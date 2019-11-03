/*
    At the time of writing (17-10-2019), the regular expression generated below was:

        /^([1-9]+[msp]|[1-7]+z|([1-9]'[1-9]{2}|[1-9]{2}'[1-9]|[1-9]{3}')[msp]|(?<ps>[1-9])('\k<ps>{2}|\k<ps>'\k<ps>|\k<ps>{2}')[msp]
        |(?<ph>[1-7])('\k<ph>{2}|\k<ph>'\k<ph>|\k<ph>{2}')z
        |(?<kh>[1-7])(xx\k<kh>|'\k<kh>{3}|\k<kh>'\k<kh>{2}|\k<kh>{2}'\k<kh>|\k<kh>{3}'|'\k<kh>'\k<kh>{2}|\k<kh>'\k<kh>'\k<kh>|\k<kh>{2}'\k<kh>')z
        |(?<ks>[1-9])(xx\k<ks>|'\k<ks>{3}|\k<ks>'\k<ks>{2}|\k<ks>{2}'\k<ks>|\k<ks>{3}'|'\k<ks>'\k<ks>{2}|\k<ks>'\k<ks>'\k<ks>|\k<ks>{2}'\k<ks>')[msp])+$/

    Obviously this is unmaintable, so instead of hard coded the regular expression we dynamically build it up
*/

const validRuns = [
    // concealed suits
    'S+[msp]',
    // concealed honors
    'H+z',
    // open chi suits - can only be from the left but doesn't check the values!
    '(S`S{2})[msp]',
    // pon of suits, must be the same tile
    '(?<ps>S) (%`## | %#`# | %##`)[msp]',
    // pon of honors, must be the same tile
    '(?<ph>H) (%`## | %#`# | %##`)z',
    // kan of honors, must be the same tile
    '(?<kh>H) (%xx# | %`### | %#`## | %##`# | %###` | %`#`## | %#`#`# | %##`#`)z',
    // kan of suits, must be the same tile
    '(?<ks>S) (%xx# | %`### | %#`## | %##`# | %###` | %`#`## | %#`#`# | %##`#`)[msp]'
];

export const validHandExpression = new RegExp(
    // Create the monstorous regular expression from our rules except...
    ('^(' + validRuns.join('|') + ')+$')
        // ...strip out white space and the dummy '%' character
            .replace(/%|\s/g, '')
        // ...expand S to valid suit ranks
            .replace(/S/g, '[1-9]')
        // ...expand H to valid honor ranks
            .replace(/H/g, '[1-7]')
        // ...collapse runs of '#'
            .replace(/#{2,}/g, (s) => `#{${s.length}}`)
        // ...replace # with what ever named group precedes it
            .replace(/#/g, (_, i, s) => '\\k' + s.slice(0, i).match(/(?:\?(<\w+>))/g).pop().slice(1))
);
