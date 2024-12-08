1. Import code from template.html, model.txt, style.css, init.js file to ractive.js component
2. In program view -> create 45program: 
    - ChangeLineChartProgram 
    - initProgram 
    - ChangeBubleChartProgram
    - ChangeBarChartProgram
    - HideInfoProgram
3. Import code from lineChart.js file to ChangeLineChartProgram
4. Import code from initProgram.js file to initProgram
5. Import code from bubleChart.js file to ChangeBubleChartProgram
5. Import code from barChart.js file to ChangeBarChartProgram
5. Import code from hideInfo.js file to HideInfoProgram
6. `Program Target filter` field in each program, set value = `stackRactive`

7. In initProgram program, set `Program variable`: `this` => `Custom Event` => `obtainData` => Save
8. In ChangeLineChartProgram program, set `Program variable`: `this` => `Custom Event` => `changeLineChart` => Save
9. In ChangeBubleChartProgram program, set `Program variable`: `this` => `Custom Event` => `changeBubleChart` => Save
10. In ChangeBarChartProgram program, set `Program variable`: `this` => `Custom Event` => `changeBarChart` => Save
11. In HideInfoProgram program, set `Program variable`: `this` => `Custom Event` => `hideInfo` => Save

12. Open `Func` screen -> Add new `Axon` program
13. Import code from func/lib.txt to file => Save
14. Open Setting modal -> Add new tag `finRemoteAsset` => Save

15. In `Graphic Builder` -> click right mouse -> `Tools` -> `Add Remote` -> `moment` -> Save