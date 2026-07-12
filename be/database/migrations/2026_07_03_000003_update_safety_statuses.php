<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE safety_patrols MODIFY COLUMN status VARCHAR(20) DEFAULT 'menunggu'");
        DB::statement("UPDATE safety_patrols SET status = 'menunggu' WHERE status IN ('draft', 'submitted')");
        DB::statement("UPDATE safety_patrols SET status = 'selesai' WHERE status = 'reviewed'");
        DB::statement("ALTER TABLE safety_patrols MODIFY COLUMN status ENUM('menunggu', 'selesai') DEFAULT 'menunggu'");

        DB::statement("ALTER TABLE safety_behavior MODIFY COLUMN status VARCHAR(20) DEFAULT 'menunggu'");
        DB::statement("UPDATE safety_behavior SET status = 'menunggu' WHERE status IN ('draft', 'submitted')");
        DB::statement("UPDATE safety_behavior SET status = 'selesai' WHERE status = 'reviewed'");
        DB::statement("ALTER TABLE safety_behavior MODIFY COLUMN status ENUM('menunggu', 'selesai') DEFAULT 'menunggu'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE safety_patrols MODIFY COLUMN status VARCHAR(20) DEFAULT 'draft'");
        DB::statement("UPDATE safety_patrols SET status = 'draft' WHERE status = 'menunggu'");
        DB::statement("UPDATE safety_patrols SET status = 'reviewed' WHERE status = 'selesai'");
        DB::statement("ALTER TABLE safety_patrols MODIFY COLUMN status ENUM('draft', 'submitted', 'reviewed') DEFAULT 'draft'");

        DB::statement("ALTER TABLE safety_behavior MODIFY COLUMN status VARCHAR(20) DEFAULT 'draft'");
        DB::statement("UPDATE safety_behavior SET status = 'draft' WHERE status = 'menunggu'");
        DB::statement("UPDATE safety_behavior SET status = 'reviewed' WHERE status = 'selesai'");
        DB::statement("ALTER TABLE safety_behavior MODIFY COLUMN status ENUM('draft', 'submitted', 'reviewed') DEFAULT 'draft'");
    }
};
