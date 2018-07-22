import { Command } from '../commands';
import { Options } from '../options';
import { Argument } from '../switches';
import { exec, execSync } from './execute';

export function extract(archive: string, args: Argument[] | Options = []) {
    return exec(Command.Extract, archive, args);
}

export function extractSync(archive: string, args: Argument[] | Options = []) {
    return execSync(Command.Extract, archive, args);
}

export function extractFullPaths(archive: string, args: Argument[] | Options = []) {
    return exec(Command.ExtractWithFullPaths, archive, args);
}

export function extractFullPathsSync(archive: string, args: Argument[] | Options = []) {
    return execSync(Command.ExtractWithFullPaths, archive, args);
}