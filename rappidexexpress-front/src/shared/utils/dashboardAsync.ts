export async function runWithLoader<T>(
  load: () => Promise<T>,
  setLoading: (loading: boolean) => void,
): Promise<T> {
  setLoading(true);
  try {
    return await load();
  } finally {
    setLoading(false);
  }
}

export function createTrailingDebounce(callback: () => void, delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const trigger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      callback();
    }, delayMs);
  };
  trigger.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };
  return trigger;
}
