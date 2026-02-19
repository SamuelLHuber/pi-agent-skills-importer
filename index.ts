import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

const DEFAULT_SKILL_DIR = join(homedir(), ".agent", "skills");
const DIRS_ENV_VAR = "PI_AGENT_SKILLS_IMPORTER_DIRS";
const DIRS_FLAG = "agent-skills-dirs";

function normalizePath(input: string, cwd: string): string {
	const trimmed = input.trim();
	if (trimmed === "~") return homedir();
	if (trimmed.startsWith("~/")) return join(homedir(), trimmed.slice(2));
	if (trimmed.startsWith("~")) return join(homedir(), trimmed.slice(1));
	return isAbsolute(trimmed) ? trimmed : resolve(cwd, trimmed);
}

function parseDirs(input: string | undefined): string[] {
	if (!input) return [];
	return input
		.split(",")
		.map((entry) => entry.trim())
		.filter((entry) => entry.length > 0);
}

export default function (pi: ExtensionAPI): void {
	pi.registerFlag(DIRS_FLAG, {
		description: "Comma-separated directories to scan for Agent Skills",
		type: "string",
	});

	pi.on("resources_discover", (event) => {
		const flagValue = pi.getFlag(DIRS_FLAG);
		const flagDirs = typeof flagValue === "string" ? parseDirs(flagValue) : [];
		const envDirs = parseDirs(process.env[DIRS_ENV_VAR]);
		const configured = flagDirs.length > 0 ? flagDirs : envDirs;
		const dirs = configured.length > 0 ? configured : [DEFAULT_SKILL_DIR];
		const resolved = dirs.map((dir) => normalizePath(dir, event.cwd)).filter((dir) => existsSync(dir));

		if (resolved.length === 0) {
			return undefined;
		}

		return { skillPaths: resolved };
	});
}
