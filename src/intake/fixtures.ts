// Synthetic papers used by the intake tests. No real people, no real accounts.

export const sampleBillText = `SAMPLE - synthetic document, not a real patient
Riverside Women's Hospital
Billing Department, 400 River Road, Columbus, OH 43004
Phone: (614) 555-0142

ITEMIZED STATEMENT
Patient: Jane Sample
Date of birth: 04/02/1994
Address: 12 Maple Street, Apt 4, Columbus, OH 43004
Account #: 88213377
Member ID: XKT445821907
Policy #: GRP-778812
Statement date: 03/20/2026
Network status: In-network

Date        Code   Description                              Qty   Amount
03/14/2026  0120   Room and board, semi-private             2     $4,800.00
03/14/2026  0720   Labor and delivery room                  1     $6,200.00
03/14/2026  85025  Complete blood count                     1     $72.50
03/14/2026  85025  Complete blood count                     1     $72.50
03/15/2026  J2590  Oxytocin injection                       2     $96.00

Total charges: $11,241.00
Insurance payments and adjustments: -$9,100.00
Amount due: $2,141.00
`;

export const sampleEobText = `SAMPLE - synthetic document, not a real patient
Buckeye Health Plan
EXPLANATION OF BENEFITS - THIS IS NOT A BILL
Member: Jane Sample
Member ID: XKT445821907
Claim #: 2026-0314-55871
Provider: Riverside Women's Hospital
Date processed: 03/28/2026
Network status: In-network

Date        Code   Description                    Qty  Billed      Allowed     Plan paid   You owe
03/14/2026  0120   Room and board, semi-private   2    $4,800.00   $3,600.00   $2,880.00   $720.00
03/14/2026  0720   Labor and delivery room        1    $6,200.00   $4,650.00   $3,720.00   $930.00
03/14/2026  85025  Complete blood count           1    $72.50      $31.00      $24.80      $6.20
03/15/2026  J2590  Oxytocin injection             2    $96.00      $40.00      $32.00      $8.00

Total       $11,168.50  $8,321.00  $6,656.80  $1,664.20
`;

export const sampleBabyBillText = `SAMPLE - synthetic document, not a real patient
Provider: Riverside Women's Hospital - Newborn Nursery
Patient: Baby Girl Sample
Statement date: March 21, 2026

Code   Description                     Amount
0171   Newborn nursery, level 1        $1,900.00
92558  Newborn hearing screening       $185.00

Total charges $2,085.00
Balance due $417.00
`;
