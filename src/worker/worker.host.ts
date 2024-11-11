import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { join } from 'path';
import { first, fromEvent, Observable } from 'rxjs';
import { Worker } from 'worker_threads';

@Injectable()
export class GenericWorkerHost
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private workers: { [key: string]: Worker } = {};
  private message$: {
    [key: string]: Observable<{ taskId: number; result: string }>;
  } = {};

  onApplicationBootstrap() {
    console.log('App started', __dirname);

    this.workers['longestSubstring'] = new Worker(
      join(__dirname, '..', '/substring/longest-substring.worker.js'),
    );
    this.message$['longestSubstring'] = fromEvent(
      this.workers['longestSubstring'],
      'message',
    ) as unknown as Observable<{ taskId: number; result: string }>;

    this.workers['uniqueSubstrings'] = new Worker(
      join(__dirname, '..', '/substring/unique-char-substrings.worker.js'),
    );
    this.message$['uniqueSubstrings'] = fromEvent(
      this.workers['uniqueSubstrings'],
      'message',
    ) as unknown as Observable<{ taskId: number; result: string }>;

    this.workers['leafNode'] = new Worker(
      join(__dirname, '..', '/binary_tree/leafnode.worker.js'),
    );
    this.message$['leafNode'] = fromEvent(
      this.workers['leafNode'],
      'message',
    ) as unknown as Observable<{ taskId: number; result: string }>;

    this.workers['anyNode'] = new Worker(
      join(__dirname, '..', '/binary_tree/anynode.worker.js'),
    );
    this.message$['anyNode'] = fromEvent(
      this.workers['anyNode'],
      'message',
    ) as unknown as Observable<{ taskId: number; result: string }>;
  }

  onApplicationShutdown() {
    Object.values(this.workers).forEach((worker) => {
      worker.terminate();
    });
  }

  run(taskType: string, input: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = this.workers[taskType];
      console.log('Worker ID: ', worker.threadId);
      const message$ = this.message$[taskType];

      if (!worker) {
        return reject(new Error('Worker not found'));
      }
      worker.postMessage(input);
      message$.pipe(first()).subscribe({
        next: resolve,
        error: reject,
      });
    });
  }
}
