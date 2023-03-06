<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class HospitalMigration extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change(): void
    {
        $hospital = $this->table('hospital');
        $hospital
            ->addColumn('user_id', 'integer')
            ->addColumn('doctor_id', 'integer', array('null' => true))
            ->create();

        $users = $this->table('users');
        $users
            ->addColumn('hospitalized', 'boolean', array('default' => false))
            ->addColumn('medical_rank', 'integer', array('default' => 0))
            ->addColumn('medical_level', 'integer', array('default' => 0))
            ->addColumn('medical_level_exp', 'integer', array('default' => 0))
            ->addColumn('patients_treated', 'integer', array('default' => 0))
            ->addColumn('medical_title', 'string', array('null' => true))
            ->addColumn('medical_exam_stage', 'string', array('null' => true))
            ->update();

        $medical_ranks = $this->table('medical_ranks');
        $medical_ranks
            ->addColumn('name', 'string')
            ->addColumn('base_level', 'integer')
            ->addColumn('max_level', 'integer')
            ->addColumn('base_regen', 'integer')
            ->addColumn('regen_gain', 'integer')
            ->addColumn('rank_required', 'integer')
            ->create();

        if ($this->isMigratingUp())
        {
            $newRanks = [
                [
                    'name' => 'Student',
                    'base_level' => 1,
                    'max_level' => 5,
                    'base_regen' => 1,
                    'regen_gain' => 5,
                    'rank_required' => 3,
                ],
                [
                    'name' => 'Practitioner',
                    'base_level' => 6,
                    'max_level' => 10,
                    'base_regen' => 25,
                    'regen_gain' => 25,
                    'rank_required' => 3,
                ],
                [
                    'name' => 'Expert',
                    'base_level' => 11,
                    'max_level' => 15,
                    'base_regen' => 200,
                    'regen_gain' => 50,
                    'rank_required' => 4,
                ],
                [
                    'name' => 'Specialist',
                    'base_level' => 16,
                    'max_level' => 20,
                    'base_regen' => 600,
                    'regen_gain' => 100,
                    'rank_required' => 4,
                ]
            ];

            $medical_ranks ->insert($newRanks)->save();
        }
    }
}
