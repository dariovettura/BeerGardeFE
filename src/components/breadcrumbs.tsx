import { Fragment } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { IconChevronRight } from '@tabler/icons-react'
import { ChevronsLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function Breadcrumbs() {
  const items = useBreadcrumbs()
  const router = useRouter()
  const pathname = router.state.location.pathname

  // Nascondi breadcrumbs su dashboard/overview
  if (items.length === 0 || pathname === '/dashboard/overview') return null

  const handleGoBack = () => {
    router.history.back()
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleGoBack}
        className="h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Breadcrumb>
        <BreadcrumbList>
        {items.map((item: { title: string; link: string }, index: number) => (
          <Fragment key={`breadcrumb-${index}`}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink asChild>
                  <Link to={item.link}>{item.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='hidden md:block'>
                <IconChevronRight />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
