let taskId = 0;
function workLoop(IdleDeadline) {
    console.log(3);
  taskId++;
  let shouldYield = false;
  while (!shouldYield) {
    console.log(taskId);
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  console.log(22);
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop);
