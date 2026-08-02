---
cssclasses:
  - centerImages
  - " centerTitles"
  - " roundedImages"
---
> [!note] Exercise
> Ask the user for the two-point X and Y coordinates in space.
   Print the straight-line distance between those two points.
   Print the exact midpoint coordinates of both.

```python title="coordinates_madness"
import math

def ask_for_coordinates(point):
    while True:
        try:
            x, y = map(
                int,
                input(
                    f"Introduce the coordinates of point {point} (Format XX YY): "
                ).split(),
            )
            return x, y
        except ValueError:
            print(
                "The values inserted did not match the criteria needed (numeric and XX YY FORMAT) \nTry again"
            )


def process_straight_line_distance(point1, point2):
    xvariation = point1[0] - point2[0]
    yvariation = point1[1] - point2[1]

    distance = math.sqrt((xvariation * xvariation) + (yvariation * yvariation))

    return distance


def process_midpoint(point1, point2):
    midpoint = (
        (point1[0] + point2[0]) / 2,
        (point1[1] + point2[1]) / 2,
    )

    return midpoint


point1 = ask_for_coordinates(1)
point2 = ask_for_coordinates(2)
distance = process_straight_line_distance(point1, point2)
midpoint = process_midpoint(point1, point2)

print(
    f"The point 1 ({point1[0]}, {point1[1]}) and "
    f"the point 2 ({point2[0]}, {point2[1]}) "
    f"have a distance of {distance:.2f} "
    f"and a midpoint at ({midpoint[0]}, {midpoint[1]})."
)

```
