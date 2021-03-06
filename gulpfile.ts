import { TestRunner, TestSet } from 'alsatian';
import del from 'del';
import gulp from 'gulp';
import GulpTSLint from 'gulp-tslint';
import * as typescript from 'gulp-typescript';
import { TapBark } from 'tap-bark';
import * as TSGulp from 'tsgulp';
import * as TSlint from 'tslint';

@TSGulp.Project('SevenZip')
export class GulpFile {
    public readonly tsProject = typescript.createProject('./src/tsconfig.json');
    public tsLintProgram = TSlint.Linter.createProgram('./src/tsconfig.json');

    constructor() {
        this.tsProject.config.exclude = ['**/*.spec.ts'];
    }

    public clean() {
        return del(<string>this.tsProject.options.outDir);
    }

    @TSGulp.Dependencies('clean')
    public compile(): void {
        this.tsProject
            .src()
            .pipe(this.tsProject())
            .pipe(gulp.dest(<string>this.tsProject.options.outDir));
    }

    @TSGulp.Default()
    @TSGulp.Dependencies('compile', 'lint', 'test-no-output')
    // tslint:disable-next-line:no-empty
    public all() {}

    public lint() {
        this.tsProject
            .src()
            .pipe(
                GulpTSLint({
                    fix: true,
                    formatter: 'stylish',
                    program: this.tsLintProgram
                })
            )
            .pipe(GulpTSLint.report());
    }

    public test() {
        this.runAlsatian('./src/**/*.spec.ts');
    }

    @TSGulp.Name('test-no-output')
    public testNoOutput() {
        this.runAlsatian('./src/**/*.spec.ts', false);
    }

    public runAlsatian(tests: string, output: boolean = true): Promise<void> {
        const testSet = TestSet.create();

        testSet.addTestsFromFiles(tests);

        const testRunner = new TestRunner();

        if (output) {
            testRunner.outputStream.pipe(TapBark.create().getPipeable()).pipe(process.stdout);
        }

        return testRunner.run(testSet);
    }
}
