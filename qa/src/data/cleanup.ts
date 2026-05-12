export class CleanupTracker {
  private ids = new Map<string, string[]>();

  track(type: string, id: string): void {
    if (!this.ids.has(type)) {
      this.ids.set(type, []);
    }
    this.ids.get(type)!.push(id);
  }

  getIds(type: string): string[] {
    return this.ids.get(type) || [];
  }

  getAll(): Map<string, string[]> {
    return this.ids;
  }

  clear(): void {
    this.ids.clear();
  }
}
