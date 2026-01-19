# Initial Requirements Discussion

## Message 1
> i'm am starting a project where we make a modular calculator to convert between lenses and formats. i want you to help me outline the core features. take a look at @research/report.md to get an idea of what matters. start with the core features we should have and then a section for optional expansions

## Message 2
> you are mixing architecture and requirements. let's think about the requirements first and the architecture second. look at @requirements.md

## Message 3
> 1) always visible
> 2) i suppose we are always choosing everything on one side, then sensor on the second side. the default should be to match the focal length, but if the user wants to pin the focal length to see the best matching aperture that should be fine
> 3) presets with a custom option

## Message 4
> why would we match based on DOF and not on blur disc?

## Message 5
> update our document to have our primary inputs and then our selection knobs (dof/blur disc, diagonal/area/etc)

# Frontend Design

## Message 6
> side by side
> expandable
> dropdowns, real number inputs, real time
> primary, below the rest
> expandable

## Message 7
> i want it to be as clean and simple as possible. they should be able to type a value to override, and there should be a subtle change in font style
> nest smaller in larger, justified to the bottom left corner
> we don't calculate DOF if we don't have subject distance. that should be optional to input

## Message 8
> if they delete it it should revert to a calculated field

# Architecture Questionnaire

## Message 9
> 1a) yes. this sounds good for a modularity, testing and extensibility standpoint
> 1b) yes. some old lenses are measured in inches, as are many film formats such as large format.
> 2a) recalculate
> 2b) override boolean, this also should affect the css
> 2c) different is fine. we can consolidate later if it turns out they are the same
> 3a) separate file
> 3b) persistable
> 3c) sure, but it needs to be CLEAN and simple, no bloat
> 4a) yes
> 4b) yes
> 4c) no
> 5a) I don't think we have enough here to warrant a server?
> 5b) nah
> 5c) no
> 6a) no
> 6b) no
> 7a) should look phenomenal on a phone. so native mobile i guess
> 7b) who uses desktop anymore?
> 8a) yes
> 8b) yes
> 8c) yes
> 9a) yes
> 9b) yes
> 10a) nah
> 10b) svg

## Message 10
> 1 (mobile-first responsive web, not native apps)

# Tech Stack

## Message 11
> looks good to me (approved: Vite, TypeScript, React, Tailwind, Jotai, Vitest, Playwright, ESLint, Prettier, Lefthook)

# Calculations

## Message 12
> i see that we say Equivalent Aperture (same DOF/blur): didn't we decide that DOF and blur are different?

## Message 13
> i'm not sure about situation 5. let's think through it more clearly. what is the user trying to do if they give a target aperture and format but no focal length

## Message 14
> no, i think if the user wants to calculate the lens they have, they can use the input values easily. by using the target, they are saying that they want one of the empty values to be calculated for them. in this case 1 is probably what they want

## Message 15
> so, what that tells us is you can't enter all three values on the target side. you must leave at least 1 blank

## Message 16
> for now, let's just clear the other one

# Project Structure

## Message 17
> what goes in index.ts? what are pnpm workspaces?

## Message 18
> what are the ramifications on testing, ci/cd, build time, etc

## Message 19
> ok, single is fine

# Data Model

## Message 20
> explain 1 and 2 (subject distance source-only vs shared, custom formats minimal vs full)

## Message 21
> ok, so definitely you can put it on the source and see calculations. however, we need to be careful about the target. when thinking about comparing two lenses, you are NOT comparing the same distance from subject. you are comparing taking the same photo but with two lenses. so if you have a full frame with a 50mm 1.4 and you want to know what full frame 85mm aperture would give the same blur disc, the assumption here is you are standing further away from the subject with your 85mm lens so that the same height/width/diagonal/area of the subject is visible

## Message 22
> can you start a quick info doc and put that plain language description i just gave in there

## Message 23
> user adds a name, and we store it (for custom formats)

## Message 23
> ok, let's make a simple readme at the root which talks about the project intent and goals. don't worry about technical details, you can point to the design docs

# Design System

## Message 24
> ok, i'm realizing we should also talk about the design language. i want clean, modern, and minimalistic. you shouldn't look at the site and think 2020, it should be effortlessly modern. how do we spec this out as actual design goals/css/guidelines?

## Message 25
> site should be dark mode only

# Info Panel Content

## Message 26
> read @README.md then @design_docs/calculations.md then @design_docs/info-content.md then finally @research/lens-equations/depth_of_field.md and @research/lens-equations/circle_of_confusion.md

## Message 27
> ok, remember, we want clean simple, and VERY understandable. take a stab at populating info-content

## Message 28
> why do they diverge only when you override focal length? substatiate your claimed based on @research/lens-equations/README.md

## Message 29
> i need to understand better how their coupling relates to using one or the other for an equivalence calculation

## Message 30
> yes. is it possible to make this more clear in the dof vs blur disc info content
