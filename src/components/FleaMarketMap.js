import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./css/FleaMarketMap.css";

const TOTAL_LOTS = 499; // Total number of lots

const FleaMarketMap = () => {
  // Initialize all lots as potentially available
  const initializeLots = () => {
    let lots = [];
    for (let i = 1; i <= TOTAL_LOTS; i++) {
      if (i >= 400 && i <= 418) {
        // Lots 400 to 418 in the first column
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 1, // First column
          gridRow: i - 399, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 420 && i <= 472) {
        // Lots 420 to 472 in the first column but starting after a gap
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 1, // Same column as previous lots
          gridRow: i - 399 + 1, // Adding 1 to create a space after lot 418
          vendorDetails: {},
        });
      } else if (i >= 474 && i <= 499) {
        // Lots 474 to 499 in the first column but starting after a gap
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 1, // Same column as previous lots
          gridRow: i - 399 + 2, // Adding 2 to create a space after lot 472
          vendorDetails: {},
        });
      } else if (i === 300 || i === 301) {
        // Lots 300 and 301
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 303 && i <= 318) {
        // Lots 303 to 318
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 320 && i <= 336) {
        // Lots 320 to 336
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 337 && i <= 342) {
        // Lots 337 to 342 (blacked out)
        lots.push({
          type: "blacked-out",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 343 && i <= 347) {
        // Lots 343 to 347 (empty space)
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 348 && i <= 353) {
        // Lots 348 to 353 (blacked out)
        lots.push({
          type: "blacked-out",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 354 && i <= 372) {
        // Lots 354 to 372
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i === 373) {
        // Lot 373 (empty space)
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 374 && i <= 396) {
        // Lots 374 to 396
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i === 397) {
        // Lot 397 (empty space)
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else if (i >= 398 && i <= 399) {
        // Lots 398 to 399
        lots.push({
          type: "potentially-available",
          lotNum: i,
          gridColumn: 2, // Column 2
          gridRow: i - 299, // Sequential rows
          vendorDetails: {},
        });
      } else {
        // Other lots
        lots.push({
          type: "potentially-available",
          lotNum: i,
          // Assign gridColumn and gridRow based on your layout for other lots
          vendorDetails: {},
        });
      }
    }
  
    return lots;
  };

  const [lots, setLots] = useState(initializeLots());

  useEffect(() => {
    const fetchVendors = async () => {
      const db = getFirestore();
      const vendorsSnapshot = await getDocs(collection(db, "Vendors"));
      const occupiedLots = vendorsSnapshot.docs.map((doc) => ({
        lotNum: parseInt(doc.data().lotNum, 10),
        vendorDetails: doc.data(),
        type: "occupied",
      }));

      // Create a copy of the initial lots array
      const initialLots = initializeLots();

      const updatedLots = initialLots.map((lot) => {
        const found = occupiedLots.find(
          (vendor) => vendor.lotNum === lot.lotNum
        );
        return found || lot;
      });

      setLots(updatedLots);
    };

    fetchVendors();
  }, []); // Keep the dependency array empty

  return (
    <div className="flea-market-map">
      {lots.map((lot, index) => (
        <div
          key={index}
          className={`lot ${lot.type}`}
          style={{
            gridColumn: lot.gridColumn,
            gridRow: lot.gridRow,
          }}
          title={
            lot.type === "occupied"
              ? `Vendor: ${lot.vendorDetails.name}`
              : "Potentially Available"
          }
        >
          {lot.lotNum}
        </div>
      ))}
    </div>
  );
};

export default FleaMarketMap;
