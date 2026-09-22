import test from "node:test";
import assert from "node:assert/strict";
import { createTrailingDebounce, runWithLoader } from "../dashboardAsync";

for (const failedResource of ["motoboys", "city"]) {
  test(`loader termina quando ${failedResource} falha`, async () => {
    const states: boolean[] = [];
    await assert.rejects(
      runWithLoader(
        async () => {
          throw new Error(`${failedResource} unavailable`);
        },
        (loading) => states.push(loading),
      ),
    );
    assert.deepEqual(states, [true, false]);
  });
}

test("eventos consecutivos geram um único refresh consolidado", async () => {
  let refreshes = 0;
  const refresh = createTrailingDebounce(() => refreshes++, 20);
  refresh();
  refresh();
  refresh();
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.equal(refreshes, 1);
  refresh.cancel();
});
