function copyFun() {
    var r = document.createRange();
    r.selectNode(document.querySelector('.short-url span'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}    