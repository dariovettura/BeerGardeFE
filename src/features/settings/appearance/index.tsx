import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export default function SettingsAppearance() {
  return (
    <ContentSection
      title='Aspetto'
      desc="Personalizza l'aspetto dell'app. Passa automaticamente tra i temi diurno e notturno."
    >
      <AppearanceForm />
    </ContentSection>
  )
}
