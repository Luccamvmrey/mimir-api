import db from "../config/firebase.js";

const CLASSES_COLLECTION = "classes";
const SUBJECTS_COLLECTION = "subjects";

const queryParameters = {
    timeIn: "timeIn",
    group: "group",
    dayOfWeek: "dayOfWeek",
    professorName: "professorName",
    roomNumber: "roomNumber",
    roomFloor: "roomFloor"
}

const DayOfWeekEnum = {
    "segunda": 0,
    "terca": 1,
    "quarta": 2,
    "quinta": 3,
    "sexta": 4,
    "sabado": 5
}

const GroupEnum = {
    "A": 0,
    "B": 1,
    "C": 2
}

export const getClasses = async (req, res) => {
    try {
        let classesQuery = db.collection(CLASSES_COLLECTION);
        const {subjectName} = req.query;

        // If subjectName is sent in the request, get classes only for that subject
        if (subjectName) {
            const subjectSnapshot = await db.collection(SUBJECTS_COLLECTION).where("subjectName", "==", subjectName).get()
            if (subjectSnapshot.empty) {
                res.status(404).send("Subject not found");
                return;
            }

            const subjectData = subjectSnapshot.docs[0].data();
            const classIdsList = subjectData.classes;

            classesQuery = classesQuery.where("classId", "in", classIdsList);
        }

        // For each possible parameter, check if it was sent in the request, if it was, add to the query
        for (const param in queryParameters) {
            if (req.query[param]) {
                let paramValue;
                if (param === "dayOfWeek") {
                    paramValue = DayOfWeekEnum[req.query[param]];
                } else if (param === "group") {
                    paramValue = GroupEnum[req.query[param]];
                } else if (param === "roomNumber" || param === "roomFloor") {
                    paramValue = parseInt(req.query[param]);
                    classesQuery = classesQuery.where(`room.${param}`, "==", paramValue);
                } else {
                    paramValue = req.query[param];
                    classesQuery = classesQuery.where(queryParameters[param], "==", paramValue);
                }
            }
        }

        // Await the query to get the snapshot of the classes
        const classesSnapshot = await classesQuery.get();
        if (classesSnapshot.empty) {
            res.status(404).send("No classes found");
            return;
        }

        const classes = [];
        classesSnapshot.forEach(doc => {
            const classData = doc.data();
            classes.push(classData);
        });

        res.status(200).json(classes);
    } catch (error) {
        console.error("Error getting classes-routes", error);
        res.status(500).send("Error getting classes");
    }
}