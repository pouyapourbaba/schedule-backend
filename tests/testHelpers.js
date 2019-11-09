// cycle is week/month/year
const aggregate = (object, userId, cycle, cycleValue) => {
  return object
    .filter(task => task.userId === userId)
    .filter(task => task[cycle] === cycleValue)
    .map(task => task.days)
    .map(days =>
      days.reduce(
        (a, b) => {
          return { duration: a.duration + b.duration };
        },
        { duration: 0 }
      )
    )
    .reduce((a, b) => {
      return a + b.duration;
    }, 0);
};

module.exports = { aggregate };
