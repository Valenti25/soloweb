"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Input,
  Textarea,
  Tabs,
  Tab,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  Switch,
  Divider,
  Progress,
  Kbd,
} from "@nextui-org/react";
import {
  Plus,
  Trash2,
  Pencil,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  BookOpen,
  Target,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ---------------- Types ----------------
export type Flashcard = {
  id: string;
  front: string;
  back: string;
  tag?: string;
  createdAt: number;
  updatedAt: number;
};

export type FlashcardCRUDProps = {
  deckId?: string;
  initialCards?: Array<Pick<Flashcard, "front" | "back" | "tag">>;
  className?: string;
  title?: string;
  description?: string;
};

// ---------------- Helpers ----------------
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function useLocalDeck(
  deckId: string,
  seed?: FlashcardCRUDProps["initialCards"]
) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (seed && seed.length && !loadedRef.current) {
      const now = Date.now();
      setCards(
        seed.map((s) => ({
          id: uid(),
          front: s.front,
          back: s.back,
          tag: s.tag,
          createdAt: now,
          updatedAt: now,
        }))
      );
      loadedRef.current = true;
    } else if (!loadedRef.current) {
      setCards([]);
      loadedRef.current = true;
    }
  }, [deckId, seed]);

  return { cards, setCards } as const;
}

// ---------------- Monochrome input styles ----------------
const monoInput = {
  base: "bg-white",
  inputWrapper:
    "bg-white border border-gray-300 hover:border-gray-400 focus-within:border-black shadow-none transition-colors",
  input: "text-black placeholder:text-gray-400",
  label: "text-gray-700",
  helperWrapper: "text-gray-500",
  description: "text-gray-500",
  errorMessage: "text-red-500",
};

// ---------------- Manage UI ----------------
function ManagePanel({
  cards,
  setCards,
}: {
  cards: Flashcard[];
  setCards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
}) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [tag, setTag] = useState("");
  const [edit, setEdit] = useState<Flashcard | null>(null);
  const frontRef = useRef<HTMLInputElement | null>(null);

  const canAdd = front.trim().length > 0 && back.trim().length > 0;

  const onAdd = () => {
    if (!canAdd) return;
    const now = Date.now();
    setCards((prev) => [
      ...prev,
      {
        id: uid(),
        front: front.trim(),
        back: back.trim(),
        tag: tag.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    setFront("");
    setBack("");
    setTag("");
    frontRef.current?.focus();
  };

  const onDelete = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };
  const onSaveEdit = () => {
    if (!edit) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === edit.id
          ? {
              ...c,
              front: edit.front,
              back: edit.back,
              tag: edit.tag,
              updatedAt: Date.now(),
            }
          : c
      )
    );
    setEdit(null);
  };

  const tags = useMemo(
    () =>
      Array.from(new Set(cards.map((c) => c.tag).filter(Boolean))) as string[],
    [cards]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
      {/* Add new */}
      <Card className="mb-8 border border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold text-black">เพิ่มแฟลชการ์ดใหม่</div>
            <p className="text-sm text-gray-500">
              กรอกคำถามและคำตอบ แล้วกดปุ่ม หรือกด <Kbd>Enter</Kbd> เพื่อบันทึก
            </p>
          </div>
          <Button
            radius="full"
            size="md"
            className="bg-black text-white hover:bg-gray-900"
            startContent={<Plus className="h-4 w-4" />}
            onClick={onAdd}
            isDisabled={!canAdd}
          >
            เพิ่มการ์ด
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className="grid gap-4 p-5 sm:p-6">
          <Input
            placeholder="พิมพ์คำถามที่ต้องการทบทวน..."
            value={front}
            onChange={(e) => setFront(e.target.value)}
            onKeyDown={onKeyDown}
            variant="bordered"
            radius="md"
            classNames={monoInput}
          />
          <Textarea
            placeholder="พิมพ์คำตอบหรือคำอธิบาย..."
            value={back}
            onChange={(e) => setBack(e.target.value)}
            minRows={4}
            onKeyDown={onKeyDown}
            variant="bordered"
            radius="md"
            classNames={monoInput}
          />
        </CardBody>
      </Card>

      {/* Stats & tags */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-700">
            ทั้งหมด <span className="font-semibold text-black">{cards.length}</span> การ์ด
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Chip
                  key={t}
                  size="sm"
                  variant="flat"
                  className="bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {t}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cards list */}
      <div className="grid gap-4">
        {cards.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 bg-white">
            <CardBody className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <BookOpen className="h-7 w-7 text-gray-800" />
              </div>
              <div className="mb-2 text-base font-semibold text-black">ยังไม่มีการ์ด</div>
              <p className="text-gray-500">เริ่มต้นสร้างแฟลชการ์ดแรกของคุณได้เลย</p>
            </CardBody>
          </Card>
        )}

        <AnimatePresence>
          {cards.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <Card className="group relative overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="flex items-start justify-between p-5">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-black text-white">
                        <span className="text-[11px] font-bold">Q</span>
                      </div>
                      <div className="text-[15px] font-semibold leading-relaxed text-black">
                        {c.front}
                      </div>
                    </div>

                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gray-800 text-white">
                        <span className="text-[11px] font-bold">A</span>
                      </div>
                      <div className="leading-relaxed text-gray-700">{c.back}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      {c.tag && (
                        <Chip
                          size="sm"
                          className="bg-gray-100 text-gray-800 border border-gray-200"
                        >
                          {c.tag}
                        </Chip>
                      )}
                      <span className="text-xs text-gray-500">
                        อัปเดต {new Date(c.updatedAt).toLocaleDateString("th-TH")}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Tooltip content="แก้ไข" placement="top">
                      <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onClick={() => setEdit(c)}
                        className="hover:bg-gray-100"
                        aria-label="edit"
                      >
                        <Pencil className="h-4 w-4 text-gray-800" />
                      </Button>
                    </Tooltip>
                    <Tooltip color="danger" content="ลบ" placement="top">
                      <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onClick={() => onDelete(c.id)}
                        className="hover:bg-gray-100"
                        aria-label="delete"
                      >
                        <Trash2 className="h-4 w-4 text-gray-800" />
                      </Button>
                    </Tooltip>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FAB */}
      <Button
        isIconOnly
        radius="full"
        size="lg"
        className="fixed bottom-6 right-6 z-20 h-14 w-14 bg-black text-white hover:bg-gray-900"
        aria-label="add card"
        onClick={() => frontRef.current?.focus()}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Edit modal */}
      <Modal isOpen={!!edit} onClose={() => setEdit(null)} size="lg" backdrop="blur">
        <ModalContent className="bg-white">
          {() => (
            <>
              <ModalHeader className="flex items-center gap-3 border-b border-gray-200">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-black text-white">
                  <Pencil className="h-4 w-4" />
                </div>
                <div className="text-base font-semibold text-black">แก้ไขการ์ด</div>
              </ModalHeader>

              <ModalBody className="gap-4 py-5">
                <Input
                  label="คำถาม (Question)"
                  value={edit?.front || ""}
                  onChange={(e) =>
                    setEdit((old) => (old ? { ...old, front: e.target.value } : old))
                  }
                  variant="bordered"
                  radius="md"
                  classNames={monoInput}
                />
                <Textarea
                  label="คำตอบ (Answer)"
                  value={edit?.back || ""}
                  minRows={4}
                  onChange={(e) =>
                    setEdit((old) => (old ? { ...old, back: e.target.value } : old))
                  }
                  variant="bordered"
                  radius="md"
                  classNames={monoInput}
                />
                <Input
                  label="แท็ก"
                  value={edit?.tag || ""}
                  onChange={(e) =>
                    setEdit((old) =>
                      old ? { ...old, tag: e.target.value || undefined } : old
                    )
                  }
                  variant="bordered"
                  radius="md"
                  classNames={monoInput}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="flat" onClick={() => setEdit(null)}>
                  ยกเลิก
                </Button>
                <Button
                  className="bg-black text-white hover:bg-gray-900"
                  startContent={<Save className="h-4 w-4" />}
                  onClick={onSaveEdit}
                >
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// ---------------- Study UI ----------------
function StudyPanel({ cards }: { cards: Flashcard[] }) {
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    setOrder(cards.map((_, i) => i));
    setIdx(0);
    setRevealed(false);
  }, [cards]);

  const total = order.length;
  const current = total > 0 ? cards[order[idx]] : undefined;

  const next = useCallback(() => {
    setRevealed(false);
    setIdx((i) => (i + 1 < total ? i + 1 : loop && total > 0 ? 0 : i));
  }, [total, loop]);

  const prev = useCallback(() => {
    setRevealed(false);
    setIdx((i) => (i - 1 >= 0 ? i - 1 : loop && total > 0 ? total - 1 : i));
  }, [total, loop]);

  const shuffle = () => {
    const arr = order.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    setIdx(0);
    setRevealed(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setRevealed((r) => !r);
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const progress = total ? ((idx + (revealed ? 1 : 0)) / total) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 lg:px-8">
      {/* Controls */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-700">
            การ์ดทั้งหมด <span className="font-semibold text-black">{total}</span>
          </div>
          <Divider orientation="vertical" className="h-6" />
          <Tooltip content="สุ่มลำดับการ์ด">
            <Button
              size="sm"
              variant="bordered"
              radius="full"
              startContent={<Shuffle className="h-4 w-4" />}
              onClick={shuffle}
              className="border-gray-300 text-black"
            >
              Shuffle
            </Button>
          </Tooltip>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            isSelected={loop}
            onValueChange={setLoop}
            size="sm"
            classNames={{
              wrapper:
                "group-data-[selected=true]:bg-black group-data-[selected=false]:bg-gray-300",
            }}
          >
            <span className="text-sm font-medium text-gray-700">วนลูป</span>
          </Switch>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress
          aria-label="progress"
          size="md"
          value={progress}
          className="h-2"
          classNames={{
            base: "bg-gray-200 rounded-full overflow-hidden",
            indicator: "bg-black",
          }}
        />
        <div className="mt-2 text-center text-sm text-gray-600">
          {Math.round(progress)}% เสร็จสิ้น
        </div>
      </div>

      {current ? (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-black text-white">
                  <span className="text-sm font-bold">{idx + 1}</span>
                </div>
                <div className="text-sm font-semibold text-gray-800">
                  การ์ดที่ {idx + 1} จาก {total}
                </div>
              </div>
              {current.tag && (
                <Chip
                  size="sm"
                  className="bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {current.tag}
                </Chip>
              )}
            </CardHeader>

            <CardBody className="space-y-8 p-8">
              {/* Question */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Target className="h-5 w-5 text-gray-800" />
                  คำถาม
                </div>
                <div className="rounded-md border border-gray-200 bg-white p-5">
                  <div className="whitespace-pre-wrap text-lg font-semibold text-black">
                    {current.front}
                  </div>
                </div>
              </div>

              <Divider />

              {/* Answer */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="h-5 w-5 text-gray-800" />
                  คำตอบ
                  {!revealed && (
                    <span className="ml-2 text-xs text-gray-500">
                      กด <Kbd>Space</Kbd> เพื่อเปิด
                    </span>
                  )}
                </div>
                <div className="min-h-[110px] rounded-md border border-gray-200 bg-white p-5">
                  <AnimatePresence mode="wait" initial={false}>
                    {revealed ? (
                      <motion.div
                        key="answer"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-pre-wrap text-base text-black"
                      >
                        {current.back}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="reveal-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex w-full justify-center"
                      >
                        <Button
                          className="bg-black text-white hover:bg-gray-900"
                          radius="full"
                          startContent={<Eye className="h-4 w-4" />}
                          onClick={() => setRevealed(true)}
                        >
                          เปิดคำตอบ
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Nav */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="bordered"
              radius="full"
              className="border-gray-300 text-black"
              startContent={<ChevronLeft className="h-4 w-4" />}
              onClick={prev}
              isDisabled={!loop && idx === 0}
            >
              ก่อนหน้า
            </Button>

            {revealed ? (
              <div className="text-sm text-gray-600">พร้อมไปต่อหรือยัง?</div>
            ) : (
              <Button
                variant="bordered"
                radius="full"
                className="border-gray-300 text-black"
                startContent={<EyeOff className="h-4 w-4" />}
                onClick={() => setRevealed(true)}
              >
                เผยคำตอบ
              </Button>
            )}

            <Button
              className="bg-black text-white hover:bg-gray-900"
              radius="full"
              endContent={<ChevronRight className="h-4 w-4" />}
              onClick={next}
              isDisabled={!loop && idx === total - 1}
            >
              ไปต่อ
            </Button>
          </div>
        </motion.div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 bg-white">
          <CardBody className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <BookOpen className="h-7 w-7 text-gray-800" />
            </div>
            <div className="mb-2 text-base font-semibold text-black">
              ยังไม่มีการ์ดสำหรับทบทวน
            </div>
            <p className="text-gray-600">ไปที่แท็บ จัดการการ์ด เพื่อเพิ่มการ์ดใหม่</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// ---------------- Root Component ----------------
export default function FlashcardCRUD({
  deckId = "my-deck",
  initialCards,
  title = "แฟลชการ์ดเรียนรู้",
  description = "โหมดจัดการและทบทวน (ขาว–ดำ)",
}: FlashcardCRUDProps) {
  const { cards, setCards } = useLocalDeck(deckId, initialCards);
  const [tab, setTab] = useState<string>("manage");

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between px-4 py-5 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">{title}</h1>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>

          <Tabs
            selectedKey={tab}
            onSelectionChange={(k) => setTab(String(k))}
            variant="underlined"
            aria-label="Flashcard tabs"
            classNames={{
              tabList: "gap-6",
              cursor: "bg-black",
              tab: "px-2 sm:px-4 py-2 font-medium text-gray-600",
              tabContent: "group-data-[selected=true]:text-black",
            }}
          >
            <Tab
              key="manage"
              title={
                <div className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  จัดการการ์ด
                </div>
              }
            />
            <Tab
              key="study"
              title={
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  โหมดทบทวน
                </div>
              }
            />
          </Tabs>
        </div>
      </div>

      {/* Body */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, x: tab === "study" ? 12 : -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="py-8"
      >
        {tab === "manage" ? (
          <ManagePanel cards={cards} setCards={setCards} />
        ) : (
          <StudyPanel cards={cards} />
        )}
      </motion.div>
    </div>
  );
}

// ---------------- Example usage ----------------
export function FlashcardCRUDExample() {
  return (
    <FlashcardCRUD
      deckId="tgat-demo"
      initialCards={[
        {
          front: "TGAT คืออะไร?",
          back: "แบบทดสอบความถนัดทั่วไปในการเข้ามหาวิทยาลัย",
          tag: "TGAT",
        },
        { front: "cos(0) เท่ากับ?", back: "1", tag: "คณิตศาสตร์" },
      ]}
    />
  );
}
