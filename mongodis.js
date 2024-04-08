const { MDBconnect, MDBdisconnect } = require("./mongoConn");
async function main(){

    const db = await MDBconnect();
    
    await db.collection('patients').insertOne({
            "patientid": "919307731511",
            "sessions": [
              {
                  "doctor": "Dr. Naresh Hushe",
                  "diagnosis": "Severe Pneumonia",
                  "treatment": "Prescribed antibiotics (Amoxicillin, Azithromycin), intravenous saline solution, oxygen therapy",
                  "remarks": "Patient admitted to ICU, closely monitored for respiratory distress",
                  "allergicMedicines": "None",
                  "hospital": "City Hospital",
                  "date": "2024-03-28"
                },
                {
                    "doctor": "Dr. Anil Aggrawal",
                    "diagnosis": "Acute Myocardial Infarction",
                    "treatment": "Prescribed aspirin, clopidogrel, nitroglycerin, beta-blockers, statins, intravenous thrombolytics",
                    "remarks": "Patient transferred to cardiac care unit (CCU) for intensive care and monitoring",
                    "allergicMedicines": "None",
                    "hospital": "County Medical Center",
                    "date": "2024-03-25"
                },
                {
                    "doctor": "Dr. Hemant Sharma",
                    "diagnosis": "Acute Renal Failure",
                    "treatment": "Prescribed diuretics, intravenous fluids (normal saline, sodium bicarbonate), dialysis",
                    "remarks": "Patient requires urgent hemodialysis due to severe electrolyte imbalances",
                    "allergicMedicines": "None",
                    "hospital": "Community Clinic",
                "date": "2024-03-22"
              }
            ]
        });
        await MDBdisconnect();
    }
    main();