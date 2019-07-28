const readline = require('readline-sync')

class Robot{
    selectTextByLanguage(lang, textInEnglish, textInPortuguese){
        switch(lang) {
            case "pt":
              return textInPortuguese;
            default:
              return textInEnglish;
          }
    }
}

module.exports = new Robot()