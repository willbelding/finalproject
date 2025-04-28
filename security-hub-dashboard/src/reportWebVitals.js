// This file was used to measure app performance and during development.
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // This allows checks for Culmative Layout Shift
      getFID(onPerfEntry); // This allows checks for First Input Delay
      getFCP(onPerfEntry); // This allows checks for First Contentful Pain
      getLCP(onPerfEntry); // This allows checks for Largest Contentful Pain
      getTTFB(onPerfEntry); // This allows checks for Time to First Byte
    });
  }
};
export default reportWebVitals;