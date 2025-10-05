
colors = [
    "yellow",
    "red",
    "amber",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
    "slate",
    "gray",
    "zinc",
    "neutral",
    "stone",
    "orange"
    ]

maxColor = 900
minColor = 100

ColorDepthList = [50,100,200,300,400,500,600,700,800,900,950]
OpacityList = range(0,101,10)


style = ""
for color in colors:
    style += "\n"
    for ColorDepth in ColorDepthList:
        for Opacity in OpacityList:
            style += '\n<div className="bg-{}-{}/{}"></div>'.format(color,str(ColorDepth),str(Opacity))

for color in colors:
    style += "\n"
    for ColorDepth in ColorDepthList:
        for Opacity in OpacityList:
            style += '\n<div className="hover:bg-{}-{}/{}"></div>'.format(color,str(ColorDepth),str(Opacity))

for color in colors:
    style += "\n"
    for ColorDepth in ColorDepthList:
        style += '\n<div className="bg-{}-{}"></div>'.format(color,str(ColorDepth),)

with open("ColorPalette.txt","wt") as text:
    text.write(style)