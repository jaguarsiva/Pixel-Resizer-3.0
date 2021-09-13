
import './helpers';
import {
    factorType,
    factorOrNull,
    ruleType,
    declarationType,
    timeoutOrNull
} from './types';

// Form Handlings
const form = document.querySelector('form')!;
const inputText = document.querySelector('#inputText') as HTMLTextAreaElement;
const outputText = document.querySelector('#outputText') as HTMLTextAreaElement;
const copyNote = document.querySelector('#copyNote') as HTMLDivElement;
const inputElements = document.querySelectorAll<HTMLInputElement>('input[type="number"]');

const alertBox = document.querySelector('#alert') as HTMLDivElement;
const alertText = document.querySelector('#alertText') as HTMLParagraphElement;
const alertClose = document.querySelector('#alertClose') as HTMLButtonElement;

//
const propertiesToResize = [
    "background-size",
    "background-position",
    "background-position-x",
    "background-position-y",
    "height",
    "width",
    "min-width",
    "max-width",
    "min-height",
    "max-height"
];

// Only one of the factors can have value at a time...
function resetInputValue( element: HTMLInputElement ) {
    element.addEventListener('focus', event => {
        inputElements.forEach( element => {
            if( element !== event.target ) element.value = '';
        });
    });
}

function handleSubmit( event: Event ) {

    event.preventDefault();

    if( !inputText.value ) return openAlert( 'CSS Rule(s) can\'t be empty!.' );

    // Check whether one input element has a value
    const factor = getFactor();
    if( !factor ) return openAlert( 'Need one factor!.' );

    const rules = getRules( inputText.value );
    const declarations = getAllDeclarations( rules );
    const multiplier = getMultiplier( factor, declarations );
    const result = getOutput( inputText.value, multiplier );
    setOutput( result );
}

function getFactor(): factorOrNull  {

    const element = Array.from( inputElements ).find( element => element.value );
    return element ? { type: element.id, value: element.valueAsNumber } : null;
}

function getMultiplier( { type, value }: factorType, declarations: declarationType[] ) {

    if( type === 'multiplier' ) return value;
    const actualValue = getValueByProperty( declarations, type );
    return parseFloat( ( value / parseFloat( actualValue ) ).toFixed(4) );
}

function getRules( rulesString: string ) {

    let rule: ruleType;
    let index = rulesString.indexOf( '{' );
    const rulesArray: ruleType[] = [];
    if( index === -1 ) {
        rule = {
            selector: 'default',
            declarations: getDeclarationsByRule( rulesString.toPrettyText() )
        };
        rulesArray.push( rule );
    }
    else {
        let start = 0, end: number;
        while( index < rulesString.length ) {
            end = rulesString.indexOf( '}', index );
            rule = {
                selector: rulesString.substring( start, index ).toPrettyText(),
                declarations: getDeclarationsByRule( rulesString.substring(index + 1, end).toPrettyText() )
            };
            start = end + 1;
            rulesArray.push( rule );
            index = rulesString.indexOf( '{', end );
            if( index === -1 ) break;
        }
    }

    return rulesArray;
}

function getDeclarationsByRule( declarationsString: string ) {

    const declarationsArray: declarationType[] = declarationsString
        .split(';')
        .slice(0, -1)
        .map( str =>  {
            const [ property, value ] = str.split(':');
            return {
                property: property.trim(),
                value: value.trim()
            };
        });
    return declarationsArray;
}

function getAllDeclarations( rules: ruleType[] ) {

    return rules
        .reduce(
            ( result: declarationType[], { declarations } ) => result.concat( ...declarations ),
            []
        );
}

function getValueByProperty( declarations: declarationType[], property: string ) {

    const declaration = declarations.find( declaration => declaration.property === property );
    return declaration ? declaration.value : '';
}

function replaceValueInDeclaration( declarations: string, multiplier: number ) {

    return declarations
        .split(';')
        .map( declaration => {
            const [ property, value ] = declaration.split(':');
            if( propertiesToResize.includes( property.trim() ) ) {
                let start = 0, end: number, valueAsNumber: number, newValue: number;
                value.trim().split(' ').forEach( subvalue => {
                    valueAsNumber = parseFloat( subvalue );
                    newValue = Math.round( ( (valueAsNumber * multiplier) + Number.EPSILON ) * 1000 ) / 1000;
                    start = declaration.indexOf( subvalue, start );
                    end = start + subvalue.length;
                    declaration = declaration.substring( 0, start )
                        .concat( declaration
                                .substring( start, end )
                                .replace( String( valueAsNumber ), String( newValue ) )
                        )
                        .concat( declaration.substring( end ) );
                });
            }
            return declaration;
        })
        .join(';');
}

function getOutput( text: string, multiplier: number ) {

    let index = text.indexOf( '{' );
    if( index === -1 ) return replaceValueInDeclaration( text, multiplier );

    let end: number, actualDeclaration: string, newDeclaration: string;
    while( index < text.length ) {
        end = text.indexOf( '}', index );
        actualDeclaration = text.substring( index + 1, end );
        newDeclaration = replaceValueInDeclaration( actualDeclaration, multiplier );
        text = text.replace( actualDeclaration, newDeclaration );
        index = text.indexOf( '{', end );
        if( index === -1 ) break;
    }
    return text;
}

async function setOutput( result: string ) {
    outputText.value = result;
    if (navigator.clipboard) {
        await navigator.clipboard.writeText( result );
        openAlert( 'Output copied to clipboard!.' );
    }
    outputText.classList.add("slide-down");
    setTimeout( () => {
        outputText.classList.remove("slide-down");
    }, 1000);
}

// Alert
let alertTimer: timeoutOrNull = null;
function openAlert( message: string ) {
    alertBox.classList.add('is-shown');
    alertText.innerText = message;
    alertTimer = setTimeout( closeAlert , 3000);
    return false;
}

function closeAlert() {
    alertBox.classList.remove('is-shown');
    alertBox.classList.add('is-removing');
    setTimeout(() => {
        alertBox.classList.remove('is-removing');
    }, 1000);
    alertText.innerText = '';
    if( alertTimer ) clearTimeout( alertTimer );
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {

    inputElements.forEach( resetInputValue );
    form.addEventListener( 'submit', handleSubmit );
    alertClose.addEventListener('click', closeAlert );

    navigator.clipboard || copyNote.classList.add('is-hidden');
});