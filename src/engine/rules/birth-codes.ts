// Billing codes for births, described in our own words.
// Source for the packaging: CMS NCCI Policy Manual for Medicare Services, Chapter VII, Section G.

// Full packages: care before the birth, the delivery and care after it.
export const FULL_PACKAGE_CODES = ["59400", "59510", "59610", "59618"];

// Every code that includes a delivery (full packages, delivery only, delivery with care after).
export const DELIVERY_CODES = [...FULL_PACKAGE_CODES, "59409", "59410", "59514", "59515", "59612", "59614", "59620", "59622"];

// Included in every delivery code: fetal monitoring during labor, episiotomy, delivery of the placenta.
export const PARTS_OF_ANY_DELIVERY = ["59050", "59051", "59300", "59414"];

// Parts of a full package: delivery-only codes, care before the birth, care after the birth.
export const PARTS_OF_FULL_PACKAGE = ["59409", "59410", "59514", "59515", "59612", "59614", "59620", "59622", "59425", "59426", "59430"];

// Anesthesia for labor is also reported once for one birth.
export const ONCE_PER_BIRTH_CODES = [...DELIVERY_CODES, "01967"];
