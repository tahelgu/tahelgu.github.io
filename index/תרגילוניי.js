function saveText() {
    let text = prompt("הכנס טקסט לשמירה:");
    if (text && text.trim() !== "") {
        localStorage.setItem("savedText", text.trim());
        alert("הטקסט נשמר בהצלחה!");
    }
}

function loadText() {
    let savedText = localStorage.getItem("savedText");
    if (savedText) {
        alert("הטקסט השמור: " + savedText);
    } else {
        alert("אין טקסט שמור.");
    }
}

// קריאה לפונקציות (אפשר להפעיל ידנית או בתוך לולאה לבחירת המשתמש)
let action = prompt("הקלד 'שמור' כדי לשמור טקסט, או 'טען' כדי לטעון טקסט:");
if (action === "שמור") {
    saveText();
} else if (action === "טען") {
    loadText();
} else {
    alert("פקודה לא מוכרת.");
}
