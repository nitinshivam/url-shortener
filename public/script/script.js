function copyFun() {
    let copyText = document.getElementById('input-short-url');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}