-- CreateTable
CREATE TABLE "BusStop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BusStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "busStopId" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusStop_name_key" ON "BusStop"("name");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_busStopId_fkey" FOREIGN KEY ("busStopId") REFERENCES "BusStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
