const Articles = document.querySelectorAll('.Article input')
const TotalPriceELement = document.querySelector('.TotalPrice span')
let totalPrice = 0
let Articless = []
Articles.forEach(element => {
    element.addEventListener('click', e => {
        let isChecked = e.target.checked
        let price = e.target.closest('.SingleArticle').querySelector('span').innerText
        let name = e.target.closest('.SingleArticle').querySelector('.SingleArticle .Article .NameAndDescription h2').innerText
        let articlePrice = parseFloat(price.substring(1));
        let newArticle = { 'name': name, 'price': articlePrice }
        if (isChecked) {

            Articless.push(newArticle);
            totalPrice += articlePrice;
        } else {
            totalPrice -= articlePrice;
            Articless = Articless.filter(x => {
                return x.name != name
            })
        }

        
        TotalPriceELement.innerText = `$${totalPrice.toFixed(2)}`
    })
})

const errors = {
    'name_surname': [],
    'phone_number': [],
    'adress': [],
    'house_number': [],
    'postal_code': [],
    'city': [],
    'email_address': [],
    'field_special': [],
}

function validateInput(input, name, ul, CssInput) {
    errors[name] = [];
    const ErrorField = input.trim();

    switch (name) {

        case 'name_surname':
            const errorMessage = ErrorField.split(' ');
            if (ErrorField.length == 0) {
                errors[name].push('Obavezno polje')
            } else if (errorMessage.length < 2) {
                errors[name].push('Unesite Ime i Prezime');
            }
            break;

        case 'phone_number':
        case 'house_number':
            if (ErrorField.length === 0) {
                errors[name].push('Obavezno polje (dozvoljen unos samo brojeva)')
            } else if (ErrorField.length <= 8) {
                errors[name].push('polje zahtjeva minimalno 9 cifara')
            }
            break;

        case 'adress':
        case 'city':
        case 'postal_code':
            if (ErrorField.length === 0) {
                errors[name].push('Obavezno polje')
            }
            break

        case 'email_address':
            const emailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
            if (ErrorField.length === 0) {
                errors[name].push('Obavezno polje')
            } else if (!emailRegex.test(input)) {
                errors[name].push('Unesite ispravnu email adresu');
            }
            break;

    }
  

    if (errors[name].length > 0) {
        CssInput?.classList.add('HasError');
    }
    else {
        CssInput?.classList.remove('HasError');
    }

    ul.innerText = errors[name];
    updateOrderButtonState();
}

function handleInputChange(e) {
    const input = e.target.value;
    const CssInput = e.target
    const name = e.target.getAttribute('name');
    const ul = e.target.closest('.parent').querySelector('ul');

    validateInput(input, name, ul, CssInput);
}

let inputs = document.querySelectorAll('form input');
inputs.forEach(element => {
    element.addEventListener('blur', handleInputChange);
});

function validateForm() {
    let isValid = true;
    for (let name in errors) {
        if (errors[name].length > 0) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

function updateOrderButtonState() {
    const orderButton = document.querySelector('button');
    orderButton.disabled = !validateForm();
}

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let formInputs = document.querySelectorAll('form input');
    let formData = {};

    formInputs.forEach(function (element) {
        const input = element.value;
        const name = element.getAttribute('name');
        const ul = element.closest('.parent').querySelector('ul');

        validateInput(input, name, ul, element);
        formData[name] = input;
    });

    if (validateForm()) {
        let TotalPrice = { 'TotalPrice': totalPrice }
        Object.assign(formData, TotalPrice, Articless)
        console.log(formData)
    }
});
