/*正则表达式入门*/

/*手机号码*/
var phoneNumber=/^1(3[0-9]|4[57]|5[0-35-9]|7[013678]|8[0-9])\d{8}$/;
var testPhoneNumbers=['18812011232','18812312','12345678909'];
for(let i=0;i<testPhoneNumbers.length;i++){
    console.log(phoneNumber.test(testPhoneNumbers[i]));
}
var noRepeat=/\b([a-zA-Z]+)\b\s+\b\1\b/g;
var testLetters=['foo foo bar','foo bar foo', 'foo barbar bar'];
for(let i=0;i<testLetters.length;i++){
    console.log(testLetters[i].match(noRepeat));
}
/*笔记：匹配单词\b\w+\b，但是\b只是匹配位置并不匹配任何字符，因此还需要匹配空白字符\s+*/