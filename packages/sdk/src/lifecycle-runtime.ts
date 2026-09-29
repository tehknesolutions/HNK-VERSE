import type { VerseContext, VerseLifecycleState, VerseRuntime, VerseRuntimeResult } from '@hnk-verse/contracts';

export type LifecycleOperation = 'initialize' | 'enter' | 'suspend' | 'resume' | 'exit' | 'dispose';

const ALLOWED: Record<LifecycleOperation, readonly VerseLifecycleState[]> = {
  initialize: ['UNINITIALIZED'],
  enter: ['READY'],
  suspend: ['ACTIVE'],
  resume: ['SUSPENDED'],
  exit: ['ACTIVE', 'SUSPENDED'],
  dispose: ['READY', 'SUSPENDED'],
};

export class VerseLifecycleRuntime {
  private current: VerseLifecycleState = 'UNINITIALIZED';
  private readonly runtime: VerseRuntime;
  constructor(runtime: VerseRuntime) { this.runtime = runtime; }
  get state(): VerseLifecycleState { return this.current; }

  private invalid(operation: LifecycleOperation): VerseRuntimeResult {
    return { ok: false, code: 'VALIDATION_FAILED', message: `INVALID_LIFECYCLE_TRANSITION:${this.current}:${operation}` };
  }

  async initialize(context: VerseContext): Promise<VerseRuntimeResult> {
    if (!ALLOWED.initialize.includes(this.current)) return this.invalid('initialize');
    this.current = 'INITIALIZING';
    const result = await this.runtime.initialize(context);
    this.current = result.ok ? 'READY' : 'UNINITIALIZED';
    return result;
  }

  async enter(context: VerseContext): Promise<VerseRuntimeResult> {
    if (!ALLOWED.enter.includes(this.current)) return this.invalid('enter');
    this.current = 'ENTERING';
    const result = await this.runtime.enter(context);
    this.current = result.ok ? 'ACTIVE' : 'READY';
    return result;
  }

  async suspend(context: VerseContext): Promise<VerseRuntimeResult> {
    if (!ALLOWED.suspend.includes(this.current)) return this.invalid('suspend');
    const result = await this.runtime.suspend(context);
    if (result.ok) this.current = 'SUSPENDED';
    return result;
  }

  async resume(context: VerseContext): Promise<VerseRuntimeResult> {
    if (!ALLOWED.resume.includes(this.current)) return this.invalid('resume');
    const result = await this.runtime.resume(context);
    if (result.ok) this.current = 'ACTIVE';
    return result;
  }

  async exit(context: VerseContext): Promise<VerseRuntimeResult> {
    if (!ALLOWED.exit.includes(this.current)) return this.invalid('exit');
    const previous = this.current;
    this.current = 'EXITING';
    const result = await this.runtime.exit(context);
    this.current = result.ok ? 'READY' : previous;
    return result;
  }

  async dispose(context: VerseContext): Promise<VerseRuntimeResult> {
    if (!ALLOWED.dispose.includes(this.current)) return this.invalid('dispose');
    const previous = this.current;
    const result = await this.runtime.dispose(context);
    this.current = result.ok ? 'DISPOSED' : previous;
    return result;
  }
}
