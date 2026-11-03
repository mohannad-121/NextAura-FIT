import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowRight, Activity, CalendarDays, Camera, Check, Footprints, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { AppEmoji } from '@/components/brand/AppEmoji';
import { CinematicHome, type SceneDef } from '@/components/home/cinematic/CinematicHome';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { exercises, getExercisesByFilters } from '@/data/exercises';
import { muscleGroups, muscleLabel } from '@/lib/trainingCatalog';
import './TrainingFlow.css';
import './Home.css';

const Anatomy = lazy(() => import('@/components/workout/AnatomyBody').then((module) => ({ default: module.AnatomyBody })));

/**
 * Homepage: one connected cinematic scroll. Every scene is a full-bleed background image
 * that evolves with scroll plus a frosted-glass panel carrying the NextAura FIT message.
 * Background photos under /home are generated placeholders standing in for licensed shots.
 */
export default function Index() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const { profile, isOnboarded } = useUser();
  const { user } = useAuth();
  const [muscle, setMuscle] = useState('chest');
  const [day, setDay] = useState(0);
  const copy = (en: string, arabic: string) => (ar ? arabic : en);
  const start = user ? (isOnboarded ? '/schedule' : '/onboarding') : '/auth';
  const results = getExercisesByFilters([muscle], null, null, null).slice(0, 3);
  const names = Object.fromEntries(Object.keys(muscleGroups).map((key) => ['muscle.' + key, muscleLabel(key, language)]));
  const featured = exercises.find((exercise) => exercise.id === 'single-arm-row');
  const featuredName = featured ? (ar ? featured.nameAr : featured.name) : copy('Single Arm Dumbbell Row', 'تجديف ذراع واحدة');

  const scenes: SceneDef[] = useMemo(() => [
    {
      id: 'hero', image: '/home/home-hero.jpg', position: '62% 40%', mobilePosition: '70% 40%', zoom: 'out', pan: 'end', height: 150, align: 'start',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('A healthier life, made personal', 'حياة صحية تناسبك')}</span>
          <h1>{copy('Your next chapter.', 'فصلك القادم.')}<br /><em>{copy('A healthier you.', 'نسخة أصح منك.')}</em></h1>
          <p className="cine-lede">{copy('Meet NextAura FIT. Your training, nutrition, and AI coach, connected around the life you want to live.', 'تعرّف على NextAura FIT. تدريبك وتغذيتك ومدربك الذكي في تجربة تناسب حياتك.')}</p>
          <div className="cine-actions">
            <Link className="cine-primary" to={start}>{copy('Start your journey', 'ابدأ رحلتك')}<ArrowRight size={18} className="rtl:rotate-180" /></Link>
            <a className="cine-link" href="#story">{copy('Explore the experience', 'اكتشف التجربة')}</a>
          </div>
          <div className="cine-promises"><span><Check size={15} />{copy('Built around you', 'مصمّم لك')}</span><span><Check size={15} />{copy('At home or the gym', 'في البيت أو النادي')}</span></div>
        </div>
      ),
    },
    {
      id: 'story', image: '/home/home-story.jpg', position: '30% 45%', mobilePosition: '35% 40%', zoom: 'in', pan: 'start', align: 'end', tint: '#1b3a5c',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('The NextAura way', 'على طريقة NextAura')}</span>
          <h2>{copy('It starts with\nyour story.', 'البداية\nمن قصتك.')}</h2>
          <p className="cine-lede">{copy('Your goals, your experience, your health. Build a personal profile with your own answers so your coaching starts in the right place.', 'أهدافك وخبرتك وصحتك. ابنِ ملفك بإجاباتك أنت لتبدأ رحلة التدريب المناسبة.')}</p>
          <div className="cine-stack glass-sub">
            {[copy('Your goals', 'أهدافك'), copy('Your starting point', 'نقطة البداية'), copy('Your weekly rhythm', 'إيقاع أسبوعك')].map((item, i) => (
              <div className="cine-row" key={item}><span>0{i + 1}</span><strong>{item}</strong><Check size={16} /></div>
            ))}
          </div>
          <small className="cine-note">{copy('No invented measurements. Every answer comes from you.', 'لا قياسات مفترضة. كل إجابة تأتي منك.')}</small>
          <div className="cine-actions"><Link className="cine-link" to={user && isOnboarded ? '/profile' : start}>{copy('Make it personal', 'خصص تجربتك')}<ArrowRight size={16} className="rtl:rotate-180" /></Link></div>
        </div>
      ),
    },
    {
      id: 'train', image: '/home/scene-02-athlete.jpg', position: '58% 30%', mobilePosition: '62% 22%', zoom: 'out', pan: 'start', align: 'start', height: 180, tint: '#0f2a46',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('Train smarter', 'تدرّب بذكاء')}</span>
          <h2>{copy('Every rep,\nguided by intelligence.', 'كل تكرار\nموجّه بالذكاء.')}</h2>
          <p className="cine-lede">{copy('NextAura FIT turns your training into a personalized performance journey: clear cues, counted reps, and a plan that adapts to you.', 'يحوّل NextAura FIT تدريبك إلى رحلة أداء شخصية: توجيهات واضحة وعدّ للتكرارات وخطة تتكيف معك.')}</p>
          <div className="cine-card glass-sub" style={{ marginTop: 22 }}>
            <header><Activity size={15} /><span>{copy('Live session', 'جلسة جارية')}</span><em>{copy('Form steady', 'الأداء ثابت')}</em></header>
            <strong>{featuredName}</strong>
            <div className="cine-reps" aria-label={copy('Set progress', 'تقدم المجموعة')}>{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < 7 ? 'is-done' : ''} />)}</div>
            <small>{copy('Rep 7 of 10 · Keep the pull slow on the way down.', 'التكرار 7 من 10 · أبطئ حركة النزول.')}</small>
          </div>
          <div className="cine-actions"><Link className="cine-link" to="/workouts">{copy('See how it works', 'اكتشف كيف يعمل')}<ArrowRight size={16} className="rtl:rotate-180" /></Link></div>
        </div>
      ),
    },
    {
      id: 'focus', image: '/home/home-focus.jpg', position: '70% 40%', mobilePosition: '65% 30%', zoom: 'in', pan: 'end', align: 'start', height: 190, tint: '#2a1f3d',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('Find your focus', 'حدد هدفك')}</span>
          <h2>{copy('Find your focus.\nMake your move.', 'حدد هدفك.\nوابدأ الحركة.')}</h2>
          <p className="cine-lede">{copy('Tap a muscle and discover real exercises from the library, with sets, reps, and clear instructions for your training space.', 'اختر عضلة واكتشف تمارين المكتبة مع المجموعات والتكرارات والتعليمات الواضحة.')}</p>
          <div className="cine-anatomy">
            <div className="glass-sub glass-bright">
              <Suspense fallback={<div className="anatomy-loading">{copy('Preparing muscle map…', 'جارٍ تجهيز خريطة العضلات…')}</div>}>
                <Anatomy compact highlightGroups selectedMuscles={[muscle]} onMuscleToggle={(id) => { if (id in muscleGroups) setMuscle(id); }} muscleNames={names} genderOverride={profile?.gender} />
              </Suspense>
            </div>
            <div>
              <div className="cine-pills">{['chest', 'abs', 'quads', 'back'].map((id) => <button key={id} aria-pressed={id === muscle} onClick={() => setMuscle(id)}>{muscleLabel(id, language)}</button>)}</div>
              {results.map((exercise) => <Link className="cine-exercise" to={'/workouts?exerciseIds=' + exercise.id} key={exercise.id}><strong>{ar ? exercise.nameAr : exercise.name}</strong><small>{exercise.sets} × {exercise.reps}</small></Link>)}
            </div>
          </div>
          <div className="cine-actions"><Link className="cine-link" to={'/workouts?muscles=' + muscle}>{copy('Explore all workouts', 'استكشف التمارين')}<ArrowRight size={16} className="rtl:rotate-180" /></Link></div>
        </div>
      ),
    },
    {
      id: 'live', image: '/home/home-live.jpg', position: '28% 45%', mobilePosition: '30% 40%', zoom: 'out', pan: 'start', align: 'end', tint: '#3a2a1a',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('Live Coach', 'المدرب المباشر')}</span>
          <h2>{copy('A little guidance.\nIn the moment.', 'توجيه بسيط.\nفي الوقت المناسب.')}</h2>
          <p className="cine-lede">{copy('Live Coach helps you practice supported movements with camera-based form feedback. Clear cues, counted reps, and a camera that stays under your control.', 'يساعدك المدرب المباشر على أداء الحركات المدعومة بتوجيه واضح وعدّ التكرارات. الكاميرا تحت سيطرتك دائماً.')}</p>
          <div className="cine-camera glass-sub"><Camera size={40} strokeWidth={1.2} /><h3>{copy('Your space. Your session.', 'مساحتك. جلستك.')}</h3><p>{copy('Full body in frame. One movement at a time.', 'أظهر جسمك كاملاً. حركة واحدة كل مرة.')}</p></div>
          <div className="cine-caption"><span><span className="cine-dot" />{copy('Camera off in preview', 'الكاميرا مغلقة في المعاينة')}</span><span>{copy('Form · Reps · Progress', 'الأداء · التكرارات · التقدم')}</span></div>
          <div className="cine-actions"><Link className="cine-link" to="/live-coach">{copy('Meet Live Coach', 'اكتشف المدرب المباشر')}<ArrowRight size={16} className="rtl:rotate-180" /></Link></div>
        </div>
      ),
    },
    {
      id: 'coach', image: '/home/scene-04-coach.jpg', position: '46% 28%', mobilePosition: '46% 18%', zoom: 'in', pan: 'end', align: 'start', height: 180, tint: '#102a3a',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('Your AI Coach', 'مدربك الذكي')}</span>
          <h2>{copy('Good questions.\nA personal conversation.', 'أسئلتك مهمة.\nوحوارك شخصي.')}</h2>
          <p className="cine-lede">{copy('Talk through your training, nutrition, or next step in English or Arabic, by text or voice, and turn the answer into your weekly plan.', 'ناقش تدريبك وتغذيتك وخطوتك القادمة بالعربية أو الإنجليزية، كتابةً أو صوتاً، وحوّل الإجابة إلى خطتك الأسبوعية.')}</p>
          <div className="cine-card glass-sub" style={{ marginTop: 22 }}>
            <header><BrandLogo mark className="cine-mark" /><span>{copy('Your NextAura coach', 'مدرب NextAura')}</span><MessageCircle size={14} style={{ marginInlineStart: 'auto', opacity: .5 }} /></header>
            <span className="cine-bubble">{copy('Where should I start?', 'من أين أبدأ؟')}</span>
            <p className="cine-answer">{copy('Let’s start with you. Tell me your goal, experience, and how many days you can train. We’ll take it one step at a time.', 'لنبدأ بك أنت. أخبرني بهدفك وخبرتك وعدد أيام التدريب المناسبة لك. سنتقدم خطوة بخطوة.')}</p>
          </div>
          <div className="cine-actions"><Link className="cine-link" to="/coach">{copy('Ask your coach', 'اسأل مدربك')}<ArrowRight size={16} className="rtl:rotate-180" /></Link></div>
        </div>
      ),
    },
    {
      id: 'week', image: '/home/home-week.jpg', position: '65% 50%', mobilePosition: '70% 45%', zoom: 'out', pan: 'start', align: 'end', height: 190, tint: '#1a2f4a',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('Your rhythm', 'إيقاعك')}</span>
          <h2>{copy('A week that works\nfor you.', 'أسبوع\nيناسبك.')}</h2>
          <p className="cine-lede">{copy('Bring training and recovery into a clear weekly rhythm, and keep your Fitbit steps and health metrics in the same picture.', 'نظّم التدريب والتعافي في أسبوع واضح، واجمع خطوات Fitbit ومؤشراتك الصحية في الصورة نفسها.')}</p>
          <div className="cine-days">
            {[0, 1, 2].map((i) => (
              <button key={i} aria-expanded={day === i} onClick={() => setDay(i)} className={day === i ? 'is-open' : ''}>
                <AppEmoji name={i === 1 ? 'leaf' : 'muscle'} />
                <div>
                  <strong>{ar ? ['الاثنين', 'الثلاثاء', 'الأربعاء'][i] : ['Monday', 'Tuesday', 'Wednesday'][i]}</strong>
                  <span>{i === 1 ? copy('Space to recover', 'وقت للتعافي') : copy('Time to move', 'وقت للحركة')}</span>
                  {day === i && <p>{copy('Your saved plan fills in your actual exercises.', 'خطتك المحفوظة تعرض تمارينك الفعلية.')}</p>}
                </div>
                <ArrowRight size={16} className="rtl:rotate-180" />
              </button>
            ))}
          </div>
          <div className="cine-metrics">
            <div className="glass-sub"><Footprints size={16} /><span>{copy('Steps & activity', 'الخطوات والنشاط')}</span><Check /></div>
            <div className="glass-sub"><Heart size={16} /><span>{copy('Synced health metrics', 'المؤشرات الصحية')}</span><Check /></div>
          </div>
          <div className="cine-actions"><Link className="cine-link" to="/schedule">{copy('Open your planner', 'افتح مخططك')}<ArrowRight size={16} className="rtl:rotate-180" /></Link><Link className="cine-link" to="/profile">{copy('Connect your Fitbit', 'اربط Fitbit')}</Link></div>
        </div>
      ),
    },
    {
      id: 'finale', image: '/home/home-hero.jpg', position: '40% 50%', mobilePosition: '45% 45%', zoom: 'in', pan: 'none', align: 'center', height: 150, tint: '#0b1f33',
      content: (
        <div className="glass">
          <span className="cine-eyebrow">{copy('Your next chapter starts here', 'فصلك القادم يبدأ هنا')}</span>
          <h2>{copy('A healthier lifestyle.\nOne good step at a time.', 'نمط حياة أصح.\nخطوة جيدة كل مرة.')}</h2>
          <div className="cine-actions"><Link className="cine-primary" to={start}>{copy('Let’s get started', 'لنبدأ معاً')}<ArrowRight size={18} className="rtl:rotate-180" /></Link></div>
        </div>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [ar, start, user, isOnboarded, muscle, day, results, names, profile?.gender, featuredName, language]);

  return (
    <div className="aura-home cine-root">
      <Navbar variant="home" />
      <a href="#home-content" className="aura-skip">{copy('Skip to content', 'انتقل إلى المحتوى')}</a>
      <main id="home-content">
        <CinematicHome scenes={scenes} rtl={ar}>
          <footer className="cine-footer">
            <div className="cine-footer-glass">
              <div className="cine-footer-brand">
                <BrandLogo onDark />
                <p>{copy('AI-Powered Healthy Lifestyle. Training, nutrition, and coaching, connected around you.', 'نمط حياة صحي مدعوم بالذكاء الاصطناعي. تدريب وتغذية وتوجيه في تجربة تناسبك.')}</p>
              </div>
              <nav className="cine-footer-links" aria-label={copy('Footer', 'تذييل الصفحة')}>
                <Link to="/workouts">{copy('Workouts', 'التمارين')}</Link>
                <Link to="/live-coach">{copy('Live Coach', 'المدرب المباشر')}</Link>
                <Link to="/coach">{copy('AI Coach', 'المدرب الذكي')}</Link>
                <Link to="/schedule">{copy('Schedule', 'الجدول')}</Link>
              </nav>
              <small>© {new Date().getFullYear()} NextAura FIT. {copy('All rights reserved.', 'جميع الحقوق محفوظة.')}</small>
            </div>
          </footer>
        </CinematicHome>
      </main>
    </div>
  );
}
