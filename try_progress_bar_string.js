

// Constants from content.js
const EMPTY_CHAR = '‒';
const FULL_CHAR = '#';
const DAILY_HOURS_TARGET = 8.5;

function getProgressBarString(hoursDiff, hoursTarget) {

    if (hoursDiff >= hoursTarget) {
        hoursDiff = hoursTarget;
    }

    let extraTimeString = '';
    if (hoursDiff < 0) {
        extraTimeString = '+' + (FULL_CHAR.repeat(Math.abs(hoursDiff) * 4));
        hoursDiff = 0;
    }

    return '|' + FULL_CHAR.repeat((DAILY_HOURS_TARGET - hoursDiff) * 4) + EMPTY_CHAR.repeat(hoursDiff * 4) + '|' + extraTimeString;
}

// SOME TESTS ---------------

// Test the function
console.log("Testing getProgressBarString function:");
console.log(`DAILY_HOURS_TARGET = ${DAILY_HOURS_TARGET}`);
console.log();


console.log("\n-1 hours worked:");
console.log(getProgressBarString(9.5, DAILY_HOURS_TARGET));

console.log("\n0 hours worked:");
console.log(getProgressBarString(8.5, DAILY_HOURS_TARGET));

console.log("\n2 hours worked:");
console.log(getProgressBarString(6.5, DAILY_HOURS_TARGET));

console.log("\n4 hours worked:");
console.log(getProgressBarString(4.5, DAILY_HOURS_TARGET));

console.log("\n6 hours worked:");
console.log(getProgressBarString(2.5, DAILY_HOURS_TARGET));

console.log("\n8.5 hours worked:");
console.log(getProgressBarString(0, DAILY_HOURS_TARGET));

console.log("\n9.5 hours worked:");
console.log(getProgressBarString(-1, DAILY_HOURS_TARGET));

console.log("\n10.5 hours worked:");
console.log(getProgressBarString(-2, DAILY_HOURS_TARGET));


