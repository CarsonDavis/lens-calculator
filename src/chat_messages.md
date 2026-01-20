# Build Frontend

## Message 1

> read @README.md @design_docs/README.md and @src/calc/README.md. your task will be to build out the front end. you can read any other linked files that are essential, such as @design_docs/design-system.md (these should be indicated by the readmes)

## Message 2

> [Plan approved]

# Fix Number Formatting

## Message 3

> looks like we are not obeying the rounding rules outlined in the architecture

## Message 4

> [Fixed - added formatDisplayValue prop to NumberInput and created specific formatters for focal length (0-1 decimals), aperture user input (1 decimal), aperture calculated (up to 2 decimals), and distance (0 decimals)]

# Update Color Scheme

## Message 5

> ok, the functionality here is looking good. however, our dark mode is basically black on extremely dark grey. i want something more modern and easier to see. what are our options?

## Message 6

> is there a way for me to try all four of them side by side? maybe you can build the page and take a screenshot and then i can compare them all

## Message 7

> github dark looks excellent

## Message 8

> [Applied GitHub Dark color scheme: background #0d1117, surface #161b22, border #30363d, text-primary #e6edf3, text-secondary #8b949e, text-muted #6e7681, accent #58a6ff]

# Fix Sensor Overlay

## Message 9

> ok, in our sensor comparison, the source is very easy to see, but the target is the same color as the background

## Message 10

> [Fixed - source now always gray (#8b949e), target always blue (#58a6ff), both with visible fills and thicker strokes]

## Message 11

> that's looking good. however our text for target is intersecting with the box for source and our text for source is being cut off. i guess that would change depending on which one is bigger, but you see the issue.

## Message 12

> [Fixed - moved labels out of SVG into a two-column grid below the visualization with format name and dimensions]

## Message 13

> i think source should be the one that has the accent highlighting and target should have the subtler

## Message 14

> [Swapped colors - source now blue (#58a6ff, accent/prominent), target now gray (#8b949e, subtle)]

## Message 15

> how are the target and source info texts justified within the sensor comparison box? they look a little strange to me. I would expect them to both be relatively in the middle, underheath the sensor image where they can be read, but source seems to be fully justified to ther left

## Message 16

> [Fixed - changed from two-column grid to centered flex container so both labels are centered together under the visualization]
