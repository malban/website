import { useState } from 'react'
import Scrollspy from 'react-scrollspy'
import ArrowRight from './icons/ArrowRight'

export default function TOC({
  className,
  cssBreakingPoint = 'xl',
  toc,
  contentSelector,
  depth = 2,
}) {
  if (!toc || !toc.length) return null
  const minLevel = toc.reduce((mLevel, item) => (!mLevel || item.lvl < mLevel) ? item.lvl : mLevel, 0)
  const tocItems = toc.filter(item => item.lvl <= minLevel + depth).map(item => ({
    ...item,
    content: item.content.replace(/[\s]?\{\#[\w\d\-_]+\}$/, '').replace(/(<([^>]+)>)/gi, ''),
    //For TOC rendering in specification files in the spec repo we have "a" tags added manually to the spec markdown document
    //MDX takes these "a" tags and uses them to render the "id" for headers like a-namedefinitionsapplicationaapplication
    //slugWithATag contains transformed heading name that is later used for scroll spy identification
    slugWithATag: item.content.replace(/<|>|"|\\|\/|=/gi, '').replace(/\s/gi, '-').toLowerCase()
  }));
  const [open, setOpen] = useState(false);

  return (
    <div className={`${className} ${tocItems.length ? '' : 'hidden'} ${cssBreakingPoint}:block md:top-24 md:max-h-(screen-14) z-20`} onClick={() => setOpen(!open)}>
      <div className={`flex cursor-pointer ${tocItems.length ? '' : 'hidden'} ${cssBreakingPoint}:cursor-auto xl:mt-2`}>
        <h5 className={`${open && 'mb-4'} flex-1 text-primary-500 font-medium uppercase tracking-wide text-sm font-sans antialiased ${cssBreakingPoint}:mb-4 ${cssBreakingPoint}:text-xs ${cssBreakingPoint}:text-gray-900 ${cssBreakingPoint}:font-bold`}>
          On this page
        </h5>
        <div className={`text-underline text-center p4 ${cssBreakingPoint}:hidden`}>
          <ArrowRight className={`${ open ? '-rotate-90' : 'rotate-90' } transform transition duration-200 ease-in-out h-6 -mt-0.5 text-primary-500`} />
        </div>
      </div>
      <div className={`${!open && 'hidden'} ${cssBreakingPoint}:block`}>
        <Scrollspy
          items={tocItems.map(item => item.slugWithATag)}
          currentClassName="text-primary-500 font-bold"
          componentTag="div"
          rootEl={contentSelector}
        >
          {
            tocItems.map((item, index) => (
              <a
                className={`pl-${(item.lvl - minLevel) * 2} block mb-1 transition duration-100 ease-in-out text-gray-900 font-normal text-sm font-sans antialiased hover:underline`}
                href={`#${item.slug}`}
                key={index}
              >
                {item.content}
              </a>
            ))
          }
        </Scrollspy>
      </div>
    </div>
  )
}