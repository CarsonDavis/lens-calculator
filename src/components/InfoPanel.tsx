import { useState } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function InfoSection({ title, children, isOpen, onToggle }: InfoSectionProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="
          w-full flex items-center justify-between
          py-3 text-left
          text-body text-text-primary
          hover:text-text-secondary transition-colors duration-150
        "
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-150 text-text-muted ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-200 ease-out
          ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="pb-4 text-text-secondary text-body leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export function InfoPanel() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <CollapsiblePanel title="Information">
      <div className="-mx-4 px-4">
        <InfoSection
          title="Subject Distance and Equivalent Lenses"
          isOpen={openSection === 'Subject Distance and Equivalent Lenses'}
          onToggle={() =>
            handleToggle('Subject Distance and Equivalent Lenses')
          }
        >
          <p>
            When comparing two lenses, you&apos;re not comparing the same
            distance from the subject — you&apos;re comparing taking the same
            photo with two different lenses.
          </p>
          <p>
            If you have a full frame camera with a 50mm f/1.4 and you want to
            know what aperture on an 85mm would give the same blur disc, the
            assumption is: you&apos;re standing further away from the subject
            with your 85mm lens so that the same height/width/diagonal/area of
            the subject is visible in the frame.
          </p>
          <p className="text-text-muted italic">
            Same framing, different distance.
          </p>
        </InfoSection>

        <InfoSection
          title="Focal Length Equivalence"
          isOpen={openSection === 'Focal Length Equivalence'}
          onToggle={() => handleToggle('Focal Length Equivalence')}
        >
          <p>
            A 50mm lens is always a 50mm lens. The glass doesn&apos;t change
            when you put it on a different camera.
          </p>
          <p>
            What changes is how much of the image circle your sensor captures. A
            smaller sensor crops into the center, so you see a narrower field of
            view — as if you&apos;d used a longer lens on a larger sensor.
          </p>
          <p>
            That&apos;s all &quot;equivalent focal length&quot; means: the focal
            length on format B that gives you the same field of view as your
            lens on format A.
          </p>
          <p className="text-text-muted italic">
            A 50mm on APS-C shows the same framing as a 75mm on full frame. The
            50mm didn&apos;t become a 75mm — you&apos;re just seeing a cropped
            portion of what the lens projects.
          </p>
        </InfoSection>

        <InfoSection
          title="Light Gathering vs Bokeh"
          isOpen={openSection === 'Light Gathering vs Bokeh'}
          onToggle={() => handleToggle('Light Gathering vs Bokeh')}
        >
          <p>
            The f-number (like f/1.4 or f/2.8) describes two different things,
            and this causes endless confusion.
          </p>
          <p>
            <strong>For exposure:</strong> f/1.4 is f/1.4 on any format. A 25mm
            f/1.4 on Micro Four Thirds and an 85mm f/1.4 on medium format both
            need the same shutter speed and ISO for a correct exposure. The
            f-number is a ratio, and ratios scale.
          </p>
          <p>
            <strong>For background blur:</strong> what matters is the physical
            size of the aperture opening — the entrance pupil. A 50mm f/1.4 lens
            has a 35.7mm entrance pupil (50 ÷ 1.4). A 25mm f/1.4 has only a
            17.9mm entrance pupil.
          </p>
          <p>
            Bigger entrance pupil = more blur. That&apos;s why &quot;equivalent
            aperture&quot; exists: it tells you what f-number on another format
            gives you the same entrance pupil, and therefore the same background
            blur.
          </p>
          <p className="text-text-muted italic">
            The 25mm f/1.4 on Micro Four Thirds gives equivalent blur to a 50mm
            f/2.8 on full frame — same entrance pupil, same blur, but also same
            depth of field. Your exposure settings would differ (f/1.4 vs
            f/2.8), but the images would look the same.
          </p>
        </InfoSection>

        <InfoSection
          title="DOF vs Blur Disc"
          isOpen={openSection === 'DOF vs Blur Disc'}
          onToggle={() => handleToggle('DOF vs Blur Disc')}
        >
          <p>These measure different things.</p>
          <p>
            <strong>Depth of field</strong> is the range of distances that
            appear sharp. It answers: &quot;how much of my scene is in
            focus?&quot; A shallow DOF means a thin slice is sharp; a deep DOF
            means more of the scene is sharp.
          </p>
          <p>
            <strong>Blur disc</strong> is how blurry an out-of-focus point
            becomes — a point of light renders as a little circle. It answers:
            &quot;how blurry does the background look?&quot; A larger blur disc
            means creamier, more dissolved backgrounds.
          </p>
          <p>
            You can have shallow DOF with modest blur (close subject, moderate
            aperture) or deep DOF with strong blur (distant subject, wide
            aperture, long lens). They&apos;re related, but not the same thing.
          </p>
          <p className="font-medium text-text-primary">
            Why this matters for equivalence
          </p>
          <p>
            When you calculate the standard equivalent focal length and
            aperture, both DOF and blur disc match automatically. A 50mm f/1.4
            on full frame and a 33mm f/0.9 on APS-C produce the same image —
            same framing, same sharpness zone, same background blur.
          </p>
          <p>
            But what if you override the focal length? Say you&apos;re comparing
            a 50mm f/1.4 on full frame to a 35mm on APS-C — not the
            &quot;equivalent&quot; 33mm, but the lens you actually own.
          </p>
          <p>Now you have to choose what &quot;equivalent&quot; means:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Match blur disc:</strong> &quot;I want the backgrounds to
              look equally blurry.&quot; Choose this when the aesthetic of the
              out-of-focus areas matters most — typically portraits.
            </li>
            <li>
              <strong>Match DOF:</strong> &quot;I want the same range of
              distances to be sharp.&quot; Choose this when you care about
              what&apos;s in focus vs out of focus — typically product shots or
              landscapes.
            </li>
          </ul>
        </InfoSection>
      </div>
    </CollapsiblePanel>
  );
}
