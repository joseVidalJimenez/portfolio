# Test Report Curler MD London

## Background
*   **Objective:** The basic objective of this test was to test the electrical connection between spring and blade and see any degradation occurs.

## Setup Description
*   The connector was actuated using scotch-yoke mechanism.
*   The test was performed to about 1000 cycles.
*   The gap between springs was closed to ensure that a solid connection was made.
*   A 10 ohm resistor was placed between each connector pair:
    *   This was used to monitor any change of resistance between the connector pairs.
    *   Before the test, each resistor value was verified.

## Resistance Values Pre Test
*   **Connector pair A:** 10 ohms
*   **Connector pair B:** 9.9 ohms

## Results

| Iteration | N of cycles | Connector pair B | Connector pair A |
| :--- | :--- | :--- | :--- |
| 1 | 104 | 9.9 | 10.0 |
| 2 | 104 | 9.9 | 10.0 |
| 3 | 105 | 9.9 | 10.0 |
| 4 | 101 | 9.9 | 10.0 |
| 5 | 102 | 9.9 | 10.0 |
| 6 | 105 | 9.9 | 10.0 |
| 7 | 104 | 9.9 | 10.0 |
| 8 | 105 | 10.1 | 10.2 |
| 9 | 104 | 10.1 | 10.2 |
| 10 | 108 | 9.9 | 10.0 |
| **Total** | **1042** | | |

**Note:** There was not a noticeable increase of resistance during 1000 cycles.

## Issues & Recommendations
During the test setup some issues came to light, they are mentioned below by category:

### Blades
*   **Issue:** They have a considerable amount of burr usually caused by manufacturing process (stamp die). This burr prevents the contact to have a good electrical connection.
    *   **Recommendation:** Post processing is required to ensure burr is not present.

### Springs
*   **Issue:** The tabs at the spring's are as long as the PCB thickness.
    *   **Recommendation:** Increase the tab length so they are mechanically locked and provide good electrical contact.
*   **Issue:** In some cases the spacing between contact faces were equal or more than the blade thickness.
    *   **Recommendation 1:** Decrease spacing between contact faces.
    *   **Recommendation 1.1:** Include a feature such as a chamfer to easy insertion.

### PCB
*   **Issue:** The springs and connection wires have a share soldering area: by trying to solder a wire the springs came out.
    *   **Recommendation:** Include through holes to solder the wires.
*   **Issue:** The cable that is connected to the PCB is very stiff and the pad that connects to take all the stress.
    *   **Recommendation:** Include through holes to solder the wires with the respective routes to the springs. This also ensures that the PCB and not the pad takes the mechanical load.

### Cage
*   **Issue:** The cage was originally included to prevent spring's external deformation. However at the moment it has not contact with the springs.
    *   **Recommendation 1:** Decrease the overall size of the cage to conform the spring dimensions.
    *   **Recommendation 2:** Remove cage from design if necessary.