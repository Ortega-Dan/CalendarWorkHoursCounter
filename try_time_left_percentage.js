

const DAILY_HOURS_TARGET = 8.5;


function getTimePercentageLeftString(hoursDiffToTarget, hoursTarget) {

    if (hoursDiffToTarget == 0) {
        return "Complete!";
    }

    let suffix = 'left';

    if (hoursDiffToTarget < 0) {
        suffix = 'over !!!';
    }

    return Math.abs(Math.round((hoursDiffToTarget / hoursTarget) * 100)) + "% " + suffix;
}



console.log("Testing getTimePercentageLeftString function:");
console.log(`DAILY_HOURS_TARGET = ${DAILY_HOURS_TARGET}`);
console.log('');

console.log("\n-1 hours worked:");
console.log(getTimePercentageLeftString(9.5, DAILY_HOURS_TARGET));

console.log("\n0 hours worked:");
console.log(getTimePercentageLeftString(8.5, DAILY_HOURS_TARGET));

console.log("\n2 hours worked:");
console.log(getTimePercentageLeftString(6.5, DAILY_HOURS_TARGET));

console.log("\n4 hours worked:");
console.log(getTimePercentageLeftString(4.5, DAILY_HOURS_TARGET));

console.log("\n6 hours worked:");
console.log(getTimePercentageLeftString(2.5, DAILY_HOURS_TARGET));

console.log("\n8.5 hours worked:");
console.log(getTimePercentageLeftString(0, DAILY_HOURS_TARGET));

console.log("\n9.5 hours worked:");
console.log(getTimePercentageLeftString(-1, DAILY_HOURS_TARGET));