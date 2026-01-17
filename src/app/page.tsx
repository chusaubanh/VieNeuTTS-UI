import { Mic, History, Layers, Play, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    label: "Total Generations",
    value: "0",
    icon: Mic,
  },
  {
    label: "LoRA Models",
    value: "1",
    icon: Layers,
  },
  {
    label: "Audio Time",
    value: "0:00",
    icon: Clock,
  },
];

const quickActions = [
  {
    title: "Generate Speech",
    description: "Chuyển văn bản thành giọng nói tự nhiên",
    icon: Play,
    href: "/tts",
    primary: true,
  },
  {
    title: "Clone Voice",
    description: "Tạo giọng mới từ audio mẫu 3-5 giây",
    icon: Mic,
    href: "/tts?mode=clone",
    primary: false,
  },
  {
    title: "Start Training",
    description: "Fine-tune model với dataset của bạn",
    icon: TrendingUp,
    href: "/training",
    primary: false,
  },
  {
    title: "View History",
    description: "Xem lại các audio đã tạo",
    icon: History,
    href: "/history",
    primary: false,
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          VieNeu TTS Studio
        </h1>
        <p className="text-[var(--text-secondary)]">
          Vietnamese Text-to-Speech với công nghệ voice cloning tức thì
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5 card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--text-primary)]">
                    {stat.value}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.title}
                href={action.href}
                className={`card p-5 card-hover flex items-start gap-4 cursor-pointer ${action.primary ? "border-[var(--accent)]" : ""
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.primary
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--bg-tertiary)]"
                    }`}
                >
                  <Icon
                    className={`w-6 h-6 ${action.primary ? "text-white" : "text-[var(--text-secondary)]"
                      }`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-semibold mb-1 ${action.primary
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-primary)]"
                      }`}
                  >
                    {action.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {action.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Model Info */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Active Model
          </h2>
          <span className="badge badge-success">Ready</span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Base Model</p>
            <p className="text-[var(--text-primary)] font-medium">
              VieNeu-TTS-0.3B
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">LoRA Adapter</p>
            <p className="text-[var(--text-primary)] font-medium">
              Ngọc Huyền
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Format</p>
            <p className="text-[var(--text-primary)] font-medium">PyTorch</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Sample Rate</p>
            <p className="text-[var(--text-primary)] font-medium">24 kHz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
