# pi-agent-skills-importer

Expose Agent Skills from external folders to pi via the `resources_discover` hook.

## What It Does

- Adds one or more skill directories to pi at startup and `/reload`
- Recursively discovers skills (root `.md` files and nested `SKILL.md` files)
- Keeps pi configuration optional: works out of the box with a default folder

## Install

```bash
pi install git:github.com/SamuelLHuber/pi-agent-skills-importer
```

Project-local install:

```bash
pi install -l git:github.com/SamuelLHuber/pi-agent-skills-importer
```

## Default

- `~/.agent/skills`

## Configuration

Use either a flag or environment variable.

Flag:

```bash
pi --agent-skills-dirs "~/.agent/skills,~/work/skills"
```

Environment variable:

```bash
export PI_AGENT_SKILLS_IMPORTER_DIRS="~/.agent/skills,~/work/skills"
```

If both are set, the flag wins. If neither is set, the default path is used.

## Notes

- Each configured directory is passed as a skill root. pi handles scanning and validation.
- Missing directories are ignored.
