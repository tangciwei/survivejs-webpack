export default (text = 'Hello world') => {
    const element = document.createElement('div');
    // bar=a;
    element.innerHTML = text;
    return element;
};
