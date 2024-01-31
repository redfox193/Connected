document.getElementById('load-button').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

document.getElementById('submit-button').addEventListener('click', submitHandler);

items = document.getElementsByClassName('grid-item')
for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', clickHandler);
}

document.getElementById('file-input').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = loader;
    reader.readAsText(file);
});

var groupNames = [];
var wordLists = [];
var colorsList = [];
var selected = 0;
var alresdySelectedCombinations = [];
var mistakes = 0;

function loader(e) {
    var contents = e.target.result;
    data = JSON.parse(contents);
    data.forEach(function(group) {
        groupNames.push(group.name);
        wordLists.push(group.words);
        colorsList.push(group.color);
    });

    var mergedWordList = [].concat(...wordLists);

    for (let i = mergedWordList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mergedWordList[i], mergedWordList[j]] = [mergedWordList[j], mergedWordList[i]];
    }

    var gridItems = document.getElementsByClassName('grid-item');
    var index = 0;

    for (var i = 0; i < gridItems.length; i++) {
        if (index >= mergedWordList.length) {
            break;
        }
        gridItems[i].textContent = mergedWordList[index];
        index++;
    }
};

function clickHandler(e) {
    if (e.target.classList.contains('grid-item-selected')) {
        e.target.classList.remove('grid-item-selected');
        selected--;
    }
    else if (selected < 4 && 
            !e.target.classList.contains('grid-item-guessed') && 
            !e.target.classList.contains('grid-item-selected'))
    {
        e.target.classList.add('grid-item-selected');
        selected++;
    }
}

function submitHandler(e) {
    var selectedItems = document.getElementsByClassName('grid-item-selected');
    
    var selectedItemsArray = [...selectedItems];

    if (selectedItemsArray.length != 4) {
        alert('Select 4 words');
        return;
    }

    for (var i = 0; i < alresdySelectedCombinations.length; i++) {
        if (alresdySelectedCombinations[i].includes(selectedItemsArray[0].textContent) &&
            alresdySelectedCombinations[i].includes(selectedItemsArray[1].textContent) &&
            alresdySelectedCombinations[i].includes(selectedItemsArray[2].textContent) &&
            alresdySelectedCombinations[i].includes(selectedItemsArray[3].textContent)) {
                alert('Combination already selected');
                return;
            }
    }

    alresdySelectedCombinations.push([
        selectedItemsArray[0].textContent, 
        selectedItemsArray[1].textContent, 
        selectedItemsArray[2].textContent, 
        selectedItemsArray[3].textContent]);

    groupPoints = [0, 0, 0, 0];
    winner = -1;
    for (var i = 0; i < groupNames.length; i++)
        for (var j = 0; j < selectedItemsArray.length; j++)
            if (wordLists[i].includes(selectedItemsArray[j].textContent)) {
                groupPoints[i]++;
                if (groupPoints[i] == 4)
                    winner = i;
            }
    
    var maxPoints = Math.max(...groupPoints);
    var mistDiv = document.getElementById('mistakes');
    if (maxPoints == 3) {
        alert('One away...');
        mistakes++;
        mistDiv.textContent = "Mistakes: " + mistakes;
    }
    else if (maxPoints <= 2) {
        mistakes++;
        mistDiv.textContent = "Mistakes: " + mistakes;
    }
    else {
        var guessedDiv = document.getElementById('guessed');
        var newDiv = document.createElement('div');
        newDiv.classList.add('answer');
        newDiv.textContent = groupNames[winner] + 
                            ": " + wordLists[winner][0] + 
                            ", " + wordLists[winner][1] + 
                            ", " + wordLists[winner][2] + 
                            ", " + wordLists[winner][3];
        newDiv.style.background = colorsList[winner];
        guessedDiv.appendChild(newDiv);
    }

    for (var i = 0; i < selectedItemsArray.length; i++)
        selectedItemsArray[i].classList.remove("grid-item-selected");
    if (maxPoints == 4) {
        for (var i = 0; i < selectedItemsArray.length; i++) {
            selectedItemsArray[i].classList.add("grid-item-guessed");
            selectedItemsArray[i].style.background = colorsList[winner];
        }
    }
    selected = 0;
}
