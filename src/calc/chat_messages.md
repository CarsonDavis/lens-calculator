# Create Calculation Module

## Message 1

> read @README.md and @design_docs/README.md. then i want you to create the calculation module. read anything else you need to accomplish this, but don't worry about reading ui documentation, etc

## Message 2

> where are you getting the values to populate your tests?

## Message 3

> have you documented the module and the tests?

## Message 4

> Module README

## Message 5

> use @CHAT_LOG_GUIDELINES.md to log this

# Review Tests for Mistakes

## Message 6

> read @research/lens-equations/README.md and the two primary files it references

## Message 7

> carefully review @src/calc/ tests for mistakes

## Message 8

> use @CHAT_LOG_GUIDELINES.md to log this to the end of the chat messages

# Fix Code Review Issues

## Message 9

> i had my jr dev review the code. here is what he said, review it to see if it makes sense or not
>
> Test Review Summary
>
> 1. blur.test.ts:11-13 — Incorrect formula for blur at infinity
>
> The test validates an approximation, not the correct formula:
>
> // Test comment says:
> // B = f² / (N × s) = 2500 / (1.4 × 2000) = 0.893mm
>
> // But Wikipedia (circle_of_confusion.md:158) says for blur of object at infinity:
> // c = f² / (N × (S₁ - f))
>
> Correct calculation:
>
> - f² / (N × (s - f)) = 2500 / (1.4 × 1950) = 0.916mm
> - Approximation used: 2500 / (1.4 × 2000) = 0.893mm
> - Error: ~2.5%
>
> The implementation in blur.ts:8 uses the approximation f² / (N × s), dropping the -f term. Both the code and test are consistent but mathematically imprecise. For portrait distances (2m with 50mm lens), the error is small but grows for closer subjects.
>
> ---
>
> 2. equivalence.test.ts:35 — Misleading comment
>
> it('calculates diagonal crop factor (~1.6 for APS-C vs FF)', () => {
> const cf = calculateCropFactorBetweenFormats(...);
> expect(cf).toBeCloseTo(0.625, 2); // APS-C is smaller, so < 1
> });
>
> The comment says "~1.6" but the expected value is 0.625. This is confusing because:
>
> - Traditional photography: crop factor = FF/APS-C = 1.6 (larger ÷ smaller)
> - This code: crop factor = target/source = APS-C/FF = 0.625
>
> The test is correct for what the code does, but the comment is misleading.
>
> ---
>
> 3. Inconsistent crop factor conventions
>
> Two different definitions exist in the codebase:
>
> - format.ts:calculateCropFactor uses FF_diagonal / diagonal = 1.6 for APS-C
> - equivalence.ts:calculateCropFactorBetweenFormats uses target / source = 0.625 (if target=APS-C, source=FF)
>
> This isn't a test bug per se, but could cause confusion when the same term means opposite things.
>
> ---
>
> 4. blur.test.ts:36-44 — Weak assertion
>
> it('calculates blur for background at specific distance', () => {
> const blur = calculateBlurDiscAtDistance(50, 1.4, 2000, 10000);
> expect(blur).toBeGreaterThan(0); // Only checks positivity
> });
>
> This test could verify the actual value (~0.733mm) against the formula from circle_of_confusion.md:132:
> c = f² × |S₂-S₁| / (N × (S₁-f) × S₂)

## Message 10

> log this to the end
