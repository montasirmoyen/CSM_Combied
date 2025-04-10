// JavaScript
// Enhanced button interactions
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.left = e.clientX - e.target.offsetLeft + 'px';
        ripple.style.top = e.clientY - e.target.offsetTop + 'px';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 500);
    });
});

// Search functionality
document.querySelector('.search-btn').addEventListener('click', () => {
    const query = document.querySelector('input').value;
    // Implement search logic
    console.log('Searching for:', query);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// MAP

let markers = {
    "Samia": {
        coords: [42.35953115120819, -71.06179066930129],
        address: "20 Somerset Street, Boston, MA 02108",
        img: "samia",
    },
    "Sawyer": {
        coords: [42.35901368307516, -71.06182274363385],
        address: "8 Ashburton Place, Boston, MA 02108",
        img: "sawyer",
    },
    "Sargent": {
        coords: [42.35681028655041, -71.06144236252693],
        address: "120 Tremont Street, Boston, MA 02108",
        img: "sargent",
    },
    "Stahl": {
        coords: [42.35776763327066, -71.06088105365221],
        address: "73 Tremont Street, Boston, MA 02108",
        img: "stahl",
    },
    "One Beacon": {
        coords: [42.358473142680474, -71.06081986034931],
        address: "1 Beacon St, Boston, MA 02108",
        img: "onebeacon",
    },
};

let clubSearchQuery = {
    "Computational Science and Math Club": {
        desc: "Offers projects, collaboration, and networking opportunities.",
        room: "Room 8065, 8th Floor",
        location: "Stahl",
    },
    "PLACEHOLDER": {
        desc: "Lorem ipsum",
        room: "Room 101, 1st Floor",
        location: "Samia",
    },
};

let MAP_ZOOM = 20;
let CENTER = [42.35873841264049, -71.06145357468266];
let map = L.map('map').setView(CENTER, MAP_ZOOM);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let markerObjects = {};

function defaultPopUpText(markerName) {
    let markerMainData = markers[markerName];
    return `<b>Location:</b> ${markerName}</b></br>
    <b>Address:</b> ${markerMainData.address}</br>
    <img src = "./images/${markerMainData.img}.jpg" style = "width:150px">`
}

for (let name in markers) {
    let markerMainData = markers[name];
    let marker = L.marker(markerMainData.coords).addTo(map);
    marker.bindPopup(defaultPopUpText(name));    
    markerObjects[name] = {marker: marker, visible: false};
    marker.setOpacity(0);
}

let activeButton = null;

function toggleMarkerPopup(name, button, clubMarker) {
    let markerData = markerObjects[name];
    let markerMainData = markers[name];

    if (markerData && markerMainData) {
        if (clubMarker) {
            let clubName = clubMarker.clubName;
            let clubData = clubMarker.clubData;
            markerData.marker.setPopupContent(`
                <b>Location:</b> ${name}</b><br>
                <b>Club:</b> ${clubName}<br>
                <b>Room:</b> ${clubData.room}<br>
                <b>Address:</b> ${markerMainData.address}
                <img src = "./images/${markerMainData.img}.jpg" style = "width:150px">`);
        } else {
            markerData.marker.setPopupContent(defaultPopUpText(name, markerMainData.address));
        }

        for (let otherName in markerObjects) {
            let otherMarkerData = markerObjects[otherName];
            if (otherName !== name && otherMarkerData.visible) {
                otherMarkerData.marker.setOpacity(0);
                otherMarkerData.marker.closePopup();
                otherMarkerData.visible = false;
            }
        }

        let marker = markerData.marker;
        if (!markerData.visible) {
            marker.setOpacity(1.0);
            marker.openPopup();
        } else {
            marker.setOpacity(0);
            marker.closePopup();
        }

        markerData.visible = !markerData.visible;

        if (activeButton && activeButton !== button) {
            activeButton.classList.remove("btn-warning");
            activeButton.classList.add("btn-primary");
        }

        if (button.classList.contains("btn-warning")) {
            button.classList.remove("btn-warning");
            button.classList.add("btn-primary");
            activeButton = null;
        } else {
            button.classList.remove("btn-primary");
            button.classList.add("btn-warning");
            activeButton = button;
        }
    }
}

let clubDropdownMenu = document.getElementById("clubDropdownMenu");

for (let clubName in clubSearchQuery) {
    let clubData = clubSearchQuery[clubName]
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#";
    a.textContent = clubName;
    a.addEventListener("click", (event) => {
        event.preventDefault();
        toggleMarkerPopup(clubData.location, a, {clubName, clubData});
    });
    li.appendChild(a);
    clubDropdownMenu.appendChild(li);
}

let locDropdownMenu = document.getElementById("locDropdownMenu");

for (let location in markers) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#";
    a.textContent = location;
    a.addEventListener("click", (event) => {
        event.preventDefault();
        toggleMarkerPopup(location, a)
    });
    li.appendChild(a);
    locDropdownMenu.appendChild(li);
}