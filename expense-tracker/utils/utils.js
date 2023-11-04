export function toFloat(num) {
    var ret = parseFloat(num);
    if(isNaN(ret)) {
        throw new Error('num is not a valid float number');
    }
    return ret;
}

export function createCSV(members, items, tax, tip, totals) {
    var header = "Item Name,Price," + members.join(',');
    var ret = header + "\n";

    for(var i = 0; i < items.length; i++) {
        var row = "";
        var item = items[i];
        row += item.name + ",";
        row += item.price + ",";
        row += item.shares.join(",");
        ret += row + "\n";
    }

    var taxRow = "Tax," + tax.price + "\n";
    var tipRow = "Tip," + tip.price + "\n";
    var totalRow = "Totals," + totals.price + "," + totals.shares.join(",") + "\n";
    ret += taxRow + tipRow + totalRow;

    return ret;
}

export function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}