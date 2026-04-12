export const salutation = (time, name) => {
    let greeting;
    
    if (time >= 5 && time < 12) greeting = `Good Morning, ${name}`;
    else if (time >= 12 && time < 17) greeting = `Good Afternoon, ${name}`;
    else if (time >= 17 && time < 21) greeting = `Good Evening, ${name}`;
    else greeting = `Good Night, ${name}`;

    return greeting;
}