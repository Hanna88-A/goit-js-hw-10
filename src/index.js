import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from '../js/api-service'
import getRefs from '../js/get-refs'

const DEBOUNCE_DELAY = 300;
const refs = getRefs();


refs.input.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry(e) {
    const name = e.target.value
    if (name.trim() === '') {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';  
        return
    }
    API.fetchCountries(name.trim()).then(renderCountries).catch(onFetchError)
}

function renderCountries(names) {
    if (names.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
    }
    if (names.length >= 2 && names.length < 10) {
        const markup = names
        .map((el) =>
            `<li class='list-item'>
                <div class='box-flag'><img src='${el.flags.svg}' alt='flag' class='img-flag'></div>
                <p class='country-name'>${el.name.official}</p>
            </li>`).join("");
    
        refs.countryList.innerHTML = markup;
        refs.countryInfo.innerHTML = '';  
    }

    if (names.length === 1) {
        const markup = names
            .map((el) =>
            `<li class='list-item'>
                <div class='box-flag'><img src='${el.flags.svg}' alt='flag' class='img-flag'></div>
                <p class='country-name'>${el.name.official}</p>
            </li>
            <p><span class='text-element'>Capital: </span> ${el.capital}</p>
            <p><span class='text-element'>Population: </span> ${el.population}</p>
            <p><span class='text-element'>Languages: </span> ${Object.values(el.languages)}</p>`).join("");  
    
        refs.countryInfo.innerHTML = markup;
        refs.countryList.innerHTML = '';    
    }   
}

function onFetchError(error) {
    Notify.failure("Oops, there is no country with that name.");
}


