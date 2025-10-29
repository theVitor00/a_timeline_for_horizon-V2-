// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
  
  function groupEventsByYear(events) {
    return events.reduce((groups, event) => {
      const year = event.year;
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
      return groups;
    }, {});
  }
  
  export { throttle, groupEventsByYear };