var currentAffixesUS = "";
var currentAffixesEU = "";

function highlightCurrentAffixes(currentAffixesUS, currentAffixesEU) {
 
     // if regions are different, change both
     if ((currentAffixesUS != currentAffixesEU) && (currentAffixesUS != "" && currentAffixesEU != "")) {
         document.getElementById(currentAffixesUS).classList.add("table__row-us");
         document.getElementById(currentAffixesUS).classList.remove("table__row");
 
         document.getElementById(currentAffixesEU).classList.add("table__row-eu");
         document.getElementById(currentAffixesEU).classList.remove("table__row");
         // if are the same affixes to the regions, highlight just one
     } else if (currentAffixesUS == currentAffixesEU) {
         document.getElementById(currentAffixesUS).classList.add("table__row-both");
         document.getElementById(currentAffixesUS).classList.remove("table__row");
     };
 
     // if any of them is blank, don't do highlight
};

function fillNextWeeksAffixes(currentAffixesEU) {
    // As the servers reset from EU are later than the US, it takes the EU as a reference.

    if (currentAffixesEU != "") {

        var row = document.getElementById(currentAffixesEU)
        var idx = row.rowIndex;

        if (idx == 11) {
            var nextweek = 12;
            var weekafternext = 1;
        } else if (idx > 11) {
            var nextweek = 1;
            var weekafternext = 2;
        } else {
            var nextweek = idx + 1;
            var weekafternext = idx + 2;
        };

        var schedtbl = document.getElementById("sched");

        var nw1 = schedtbl.rows[nextweek].cells[0].innerHTML;
        var nw2 = schedtbl.rows[nextweek].cells[1].innerHTML;
        var nw3 = schedtbl.rows[nextweek].cells[2].innerHTML;
        var nw4 = schedtbl.rows[nextweek].cells[3].innerHTML;

        var wan1 = schedtbl.rows[weekafternext].cells[0].innerHTML;
        var wan2 = schedtbl.rows[weekafternext].cells[1].innerHTML;
        var wan3 = schedtbl.rows[weekafternext].cells[2].innerHTML;
        var wan4 = schedtbl.rows[weekafternext].cells[3].innerHTML;

        document.getElementById("nextweek").innerHTML = "" + nw1 + ", " + nw2 + ", " + nw3 + ", " + nw4;
        document.getElementById("weekafternext").innerHTML = "" + wan1 + ", " + wan2 + ", " + wan3 + ", " + wan4;

    };

};

function getAffixes(region) {

    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        var affixName = "";
        var currentAffixes = "";

        xhr.onreadystatechange = function() {

            if (xhr.readyState == 4 && xhr.status == 200) {
                var parsed_json_respone = JSON.parse(this.responseText);
                var affixes = parsed_json_respone.affix_details;

                var affix_list = [
                    {
                        "name": "Bursting",
                        "difficulty": "med"
                    },
                    {
                        "name": "Bolstering",
                        "difficulty": "med"
                    },
                    {
                        "name": "Explosive",
                        "difficulty": "med"
                    },
                    {
                        "name": "Fortified",
                        "difficulty": "hard"
                    },
                    {
                        "name": "Grievous",
                        "difficulty": "med"
                    },
                    {
                        "name": "Inspiring",
                        "difficulty": "easy"
                    },
                    {
                        "name": "Necrotic",
                        "difficulty": "hard"
                    },
                    {
                        "name": "Prideful",
                        "difficulty": "med"
                    },
                    {
                        "name": "Quaking",
                        "difficulty": "easy"
                    },
                    {
                        "name": "Raging",
                        "difficulty": "med"
                    },
                    {
                        "name": "Sanguine",
                        "difficulty": "easy"
                    },
                    {
                        "name": "Spiteful",
                        "difficulty": "med"
                    },
                    {
                        "name": "Storming",
                        "difficulty": "med"
                    },
                    {
                        "name": "Tyrannical",
                        "difficulty": "hard"
                    },
                    {
                        "name": "Volcanic",
                        "difficulty": "easy"
                    }
                ];

                //start the output by putting the title in place
                document.getElementById("thisweek" + region).innerHTML = "<span class='title__intro'>" + region + " " + "</span>";

                //fill it up with the affixes
                affixes.forEach(function(affix) {

                    //get the difficulty
                    affix_list.forEach(function(list_affix) {
                        if (affix.name == list_affix.name) {
                            affix.difficulty = list_affix.difficulty; //id
                        }
                    });

                    //get current week affixes key: 2 first chars and lowercase
                    currentAffixes = affix.name.toLowerCase().substr(0, 2) + currentAffixes;
                    //print it
                    document.getElementById("thisweek" + region).innerHTML += "<span class='" + affix.difficulty + " trn'>" + affix.name + "</span>" + " ";
                });

                if (region == "us") currentAffixesUS = currentAffixes;
                if (region == "eu") currentAffixesEU = currentAffixes;

                // if the affixes are the same for both regions, don't show both regions
                if ((currentAffixesUS == currentAffixesEU) && (currentAffixesUS != "" && currentAffixesEU != "")) {
                    document.getElementById("thisweekeu").remove();
                    document.getElementById("thisweekus").getElementsByTagName("span")[0].style.display = "none";
                };

                highlightCurrentAffixes(currentAffixesUS, currentAffixesEU);
                highlightCurrentAffixDescriptions(affixes, region);
                fillNextWeeksAffixes(currentAffixesEU);

                resolve();
            } else if (xhr.readyState == 4 && xhr.status !== 200){
                currentAffixes = null;
                reject();
            }
        };
//        xhr.open('GET', 'https://raider.io/api/v1/mythic-plus/affixes?region=' + region, true);
        xhr.open('GET', './affix-' + region, true);
        xhr.send();
    });

};

function highlightCurrentAffixDescriptions(affixes, region) {
        affixes.forEach(function(affix) {
            var name = affix.name;
            var elms = document.querySelectorAll('ul.affixes-list li');

            elms.forEach(function(el) {
                if (classie.has(el, 'affix-' + name.toLowerCase()))
                {
                    var ribbon;
                    var ribbonColor = (region === 'us') ? 'red' : 'blue';

                    if (classie.has(el, 'thisweek'))
                    {
                        // There must already be a ribbon
                        ribbon = el.querySelector('div.ribbon');
                        var regionLabel = ribbon.querySelector("span");
                        regionLabel.innerText = "US & EU";
                        classie.removeClass(ribbon, 'blue');
                        classie.removeClass(ribbon, 'red');
                        classie.addClass(ribbon, 'green');
                    } else {
                        classie.addClass(el, 'thisweek');

                        // Let's add a ribbon
                        ribbon = document.createElement('div');
                        classie.addClass(ribbon, 'ribbon');
                        classie.addClass(ribbon, ribbonColor);

                        // Label the region
                        var span = document.createElement('span');
                        span.innerText = region.toUpperCase();

                        ribbon.appendChild(span);
                        el.appendChild(ribbon);
                    }
                }
            })
        });
}

function getRegionalAffixes() {
    var promises = [
        getAffixes('us'),
        getAffixes('eu')
    ];

    window.getAffixesReady = Promise.all(promises);
};

getRegionalAffixes();

!function(a){"use strict";function b(a){return new RegExp("(^|\\s+)"+a+"(\\s+|$)")}function f(a,b){var f=c(a,b)?e:d;f(a,b)}var c,d,e;"classList"in document.documentElement?(c=function(a,b){return a.classList.contains(b)},d=function(a,b){a.classList.add(b)},e=function(a,b){a.classList.remove(b)}):(c=function(a,c){return b(c).test(a.className)},d=function(a,b){c(a,b)||(a.className=a.className+" "+b)},e=function(a,c){a.className=a.className.replace(b(c)," ")});var g={hasClass:c,addClass:d,removeClass:e,toggleClass:f,has:c,add:d,remove:e,toggle:f};"function"==typeof define&&define.amd?define(g):a.classie=g}(window),!function(){function a(a){classie.add(a.target.parentNode,"input--filled")}function b(a){""===a.target.value.trim()&&classie.remove(a.target.parentNode,"input--filled")}String.prototype.trim||!function(){var a=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;String.prototype.trim=function(){return this.replace(a,"")}}(),[].slice.call(document.querySelectorAll("input.input__field")).forEach(function(c){""!==c.value.trim()&&classie.add(c.parentNode,"input--filled"),c.addEventListener("focus",a),c.addEventListener("blur",b)})}();
