// Initialization when the window loads.
const chartState = new SubChartState();
chartState.newChart();
// Mark the user as being finished with analysis.
sessionStorage.setItem('hasAnalyzedQuestions', true);