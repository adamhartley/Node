const deleteProduct = (btn) => {
    console.log('Delete button clicked!');
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
    const reporting = btn.parentNode.querySelector('[name=reporting]').value;
    const useMongoose = btn.parentNode.querySelector('[name=useMongoose]').value;
    let targetUrl;
    const productElement = btn.closest('article');

    if (reporting && useMongoose) {
        targetUrl = '/reporting/mongoose/admin/product/';
    } else if (reporting && !useMongoose) {
        targetUrl = '/reporting/admin/product/';
    } else {
        targetUrl = '/admin/product/';
    }

    fetch(targetUrl + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            productElement.parentNode.removeChild(productElement); // need to use parentNode to support Internet Explorer
        })
        .catch(err => {
            console.log(err);
        })
};